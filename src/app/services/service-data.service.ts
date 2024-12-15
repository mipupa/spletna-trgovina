import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore'
import { Service } from '../model/service';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceDataService {

  constructor(private afs: AngularFirestore) { }

  addService(service: Service)
  {
    service.id = this.afs.createId();
    return this.afs.collection('/services').add(service);
  }

  getAllServices(): Observable<any[]>
  {
    return this.afs.collection('/services').snapshotChanges();
  }

  deleteService(service: Service)
  {
    return this.afs.doc('/services/' + service.id).delete();
  }

  updateService(service: Service)
  {
    this.deleteService(service);
    this.addService(service)
  } 
  
  getServiceById(serviceId: string): Observable<any> {
    return this.afs.doc('/services/' + serviceId).valueChanges();
  }

}
