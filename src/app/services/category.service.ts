import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { Category } from '../model/category';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private afs: AngularFirestore) { }
  /*
    addCategories(): void {
      const categories = [
        { CategoryID: 1, name: 'Smuči' },
        { CategoryID: 2, name: 'Smučarski čevlji' },
        { CategoryID: 3, name: 'Dodatna oprema' },
      ];
  
      const collectionRef = this.afs.collection('Category');
      categories.forEach((Category) => {
        collectionRef.doc(Category.CategoryID.toString()).set(Category)
          .then(() => console.log(`Kategorija ${Category.name} uspešno dodana!`))
          .catch((error) => console.error('Napaka pri dodajanju kategorije:', error));
      });
      
    }
  */
  getCategories(): Observable<Category[]> {
    return this.afs.collection<Category>('Category').valueChanges();

  }
  
  getCategoryNames(categoryIds: number[]): Observable<{ [key: number]: string }> {
    if (!categoryIds.length) {
      return of({});
    }

    return this.afs
      .collection('Category', ref => ref.where('CategoryID', 'in', categoryIds)) // Filter categories by CategoryID
      .valueChanges()
      .pipe(
        map((categories: any[]) => {
          const categoryMap: { [key: number]: string } = {};
          categories.forEach(category => {
            categoryMap[category.CategoryID] = category.name; // Map CategoryID to name
          });
          return categoryMap;
        })
      );
  }
   
}