import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore'
import { Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class KosaricaService {

  constructor(private afs: AngularFirestore,private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  getCartData(uid: string): Observable<any> {
    return this.firestore.collection('Cart').doc(uid).get();
  }
  updateCart(updatedCartData: any) {
    return this.afAuth.user.pipe(
      take(1),
      switchMap(currentUser => {
        if (currentUser) {
          return from(this.afs.collection('Cart').doc(currentUser.uid).update(updatedCartData));
        } else {
          throw new Error('User not logged in');
        }
      })
    );
  }
  addProductToCart(productId: number): void {
    this.afAuth.user.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this.getCartData(user.uid).pipe(
            switchMap(cartData => {
              const updatedProductIds = [...cartData.productIds, productId];
              const updatedCartData = { ...cartData, productIds: updatedProductIds };
              return from(this.updateCart(updatedCartData));
            })
          );
        } else {
          throw new Error('User not logged in');
        }
      })
    ).subscribe();
  }

}
