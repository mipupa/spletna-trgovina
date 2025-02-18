
import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore'
import { UserData } from '../model/user-data';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  email: string = '';
  name: string = '';
  mobile: string = '';
  uid: string = '';
  friendcount: number = 0;
  image: string = '';
 
 
  constructor(private afs: AngularFirestore, private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  addUsers(service: UserData)
  {
    return this.afs.collection('/User').add(service);
  }

  getAllUsers()
  {
    return this.afs.collection('/User').snapshotChanges();
  }

  deleteUsers(service: UserData)
  {
    return this.afs.doc('/User/' + service.uid).delete();
  }

  updateService(service: UserData)
  {
    this.deleteUsers(service);
    this.addUsers(service)
  }

  getToken(user :UserData)
  {
    return this.afs.doc('/User/' + user.uid)
  }

  getUserData(uid: string): Observable<any> {
    return this.firestore.collection('User').doc(uid).get();
  }
  updateUserProfile(userData: any) {
    return this.afAuth.user.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return from(this.afs.collection('User').doc(user.uid).update(userData));
        } else {
          throw new Error('User not logged in');
        }
      })
    );
  }

}
