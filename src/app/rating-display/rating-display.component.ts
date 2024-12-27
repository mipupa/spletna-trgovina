import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-rating-display',
  templateUrl: './rating-display.component.html',
  styleUrls: ['./rating-display.component.scss']
})
export class RatingDisplayComponent implements OnInit {
  @Input() productId!: number; // Sprejme ID produkta
  @Input() readonly = false; // Način samo za prikaz povprečne ocene
  
  stars = [1, 2, 3, 4, 5];
  rating = 0; // Trenutna ocena uporabnika  
  isRated = false;
  isLoggedIn = false;
  uid!: string;
  averageRating$!: Observable<number | null>; // Povprečna ocena produkta

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token; 

    if (this.isLoggedIn) {
      // pridobivanje uid iz localstorage tokena
      this.uid = token || '';
      this.checkExistingRating(); // Preverjanje obstoječe ocene uporabnika
    } 
     else 
      { 
       this.checkAnyRating(); // Preverjanje kakršnekoli ocene
      }
        
    // Pridobivanje povprečne ocene
    this.calculateAverageRating();
    
  }

  rateProduct(value: number) {
    if (this.readonly || this.isRated || !this.isLoggedIn) return;

    this.rating = value;    
    this.isRated = true;

    // Shranjevanje ocene v Firebase
    const docId = `${this.uid}_${this.productId}`;
    this.firestore.collection('Rating').doc(docId).set({
      uid: this.uid,
      ProductID: this.productId,
      rating: value,
    }).then(() => this.calculateAverageRating()); // Osveži povprečno oceno
  }

  checkExistingRating() {
    // Preveri, če je uporabnik že ocenil produkt
    this.firestore
      .collection('Rating', ref =>
        ref.where('uid', '==', this.uid).where('ProductID', '==', this.productId)
      )
      .valueChanges()
      .subscribe(ratings => {
        if (ratings.length > 0) {
          const userRating = ratings[0] as any; // Pretvorba v ustrezno obliko
          this.rating = userRating.rating;
          this.isRated = true;
          
        }
      });
  }
  checkAnyRating() {
    // Preveri, če je uporabnik že ocenil produkt
    this.firestore
      .collection('Rating', ref =>
        ref.where('ProductID', '==', this.productId)
      )
      .valueChanges()
      .subscribe(ratings => {
        if (ratings.length > 0) {
          const userRating = ratings[0] as any; // Pretvorba v ustrezno obliko
          this.rating = userRating.rating;
          this.isRated = true;
          
        }
      });
  }

  calculateAverageRating() {
    // Izračun povprečne ocene produkta
    this.averageRating$ = this.firestore
      .collection('Rating', ref => ref.where('ProductID', '==', this.productId))
      .valueChanges()
      .pipe(
        map((ratings: any[]) => {
          if (ratings.length === 0) return null; // Ni ocen
          const total = ratings.reduce((sum, r) => sum + r.rating, 0);
          return total / ratings.length;
          
        })
      );
  }

  isStarFilled(index: number, avgRating: number | null = null): boolean {
    if (this.readonly) {
      // Če prikazujemo povprečno oceno
      return index < (avgRating || 0);
    }
    // Če prikazujemo trenutno oceno ali hover
    return index < (this.rating);
  }

}
