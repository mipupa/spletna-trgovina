import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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

  addPoslovalnica(poslovalnica: Omit<Poslovalnica, 'id'>): Promise<void> {
    const id = this.afs.createId(); // Ustvari unikaten ID
    return this.afs
      .collection<Poslovalnica>(this.collectionName)
      .doc(id)
      .set({ ...poslovalnica, id }); // Dodaj podatke skupaj z ID-jem
  }
}

  

