import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Timestamp } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Order {
  id?: string;
  uid: string;
  orderDate: string;
  totalPrice: number;
  orderNumber: string;
  status: string;

  items: { name: string; quantity: number; price: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private uid: string | null = null;

  constructor(private firestore: AngularFirestore) {
    this.uid = localStorage.getItem('token'); // Pridobi trenutni uid iz localStorage
  }

  getOrders(): Observable<any[]> {
    if (!this.uid) {
      throw new Error('Uporabnik ni prijavljen.');
    }

    return this.firestore
      .collection('Orders', ref => ref.where('uid', '==', this.uid))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;

            // Pretvori `Timestamp` v `Date`
            data.orderDate = data.orderDate ? data.orderDate.toDate() : null;

            return { id, ...data };
          })
        )
      );
  }
}