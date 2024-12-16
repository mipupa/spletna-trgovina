import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Timestamp } from 'rxjs';


export interface Poslovalnica {
  id: string;
  address: string;
  contact: string;
  img_url: string;
  loc_lat: number;
  loc_lng: number;
  manager: string;
  name: string;
  working_hours: string;
}



@Injectable({
  providedIn: 'root'
})
export class PoslovalniceService {
  private collectionName = 'Branch';

  constructor(private afs: AngularFirestore) {}

  // Pridobi seznam poslovalnic
  getBranches(): Observable<Poslovalnica[]> {
    return this.afs.collection<Poslovalnica>(this.collectionName).valueChanges();
  }

  //dodaj novo poslovalnico
  addPoslovalnica(poslovalnica: Omit<Poslovalnica, 'id'>): Promise<void> {
    const id = this.afs.createId(); // Ustvari unikaten ID
    return this.afs
      .collection<Poslovalnica>(this.collectionName)
      .doc(id)
      .set({ ...poslovalnica, id }); // Dodaj podatke skupaj z ID-jem
  }

  //shrani v izbran collection in izbran document
  saveDataToDocument(collectionName: string, documentId: string, data: any): Observable<void> {
    return new Observable<void>((observer) => {
      this.afs
        .collection(collectionName)
        .doc(documentId)
        .set(data)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getNotificationsByBranch(branchId: number): Observable<any[]> {
    return this.afs
    .collection('Notification', (ref) => ref.where('BranchID','==', branchId))
    .valueChanges({idField: 'NotificationID'});
    
  }
}