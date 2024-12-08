import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../model/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private afs:AngularFirestore) { }


  addProducts(): void {
    // Definiraj kategorije in produkte
    const products = [
      { ProductID: 1, CategoryID: '1', name: 'Produkt_1', price: 250.99, description: 'Opis', warranty: '1 leto', specification: 'Specifikacije', manufacturer_url:'https://www.somelink.com', img_url:'assets/img/product_1.jpg' },
      { ProductID: 2, CategoryID: '1', name: 'Produkt_2', price: 250.99, description: 'Opis', warranty: '1 leto', specification: 'Specifikacije', manufacturer_url:'https://www.somelink.com', img_url:'assets/img/product_2.jpg' },
      { ProductID: 3, CategoryID: '1', name: 'Produkt_3', price: 250.99, description: 'Opis', warranty: '1 leto', specification: 'Specifikacije', manufacturer_url:'https://www.somelink.com', img_url:'assets/img/product_3.jpg' },
      { ProductID: 4, CategoryID: '1', name: 'Produkt_4', price: 250.99, description: 'Opis', warranty: '1 leto', specification: 'Specifikacije', manufacturer_url:'https://www.somelink.com', img_url:'assets/img/product_4.jpg' },
      { ProductID: 5, CategoryID: '1', name: 'Produkt_5', price: 250.99, description: 'Opis', warranty: '1 leto', specification: 'Specifikacije', manufacturer_url:'https://www.somelink.com', img_url:'assets/img/product_5.jpg' },
      { ProductID: 6, CategoryID: '1', name: 'Produkt_6', price: 250.99, description: 'Opis', warranty: '1 leto', specification: 'Specifikacije', manufacturer_url:'https://www.somelink.com', img_url:'assets/img/product_6.jpg' },
      { ProductID: 7, CategoryID: '1', name: 'Produkt_7', price: 250.99, description: 'Opis', warranty: '1 leto', specification: 'Specifikacije', manufacturer_url:'https://www.somelink.com', img_url:'assets/img/product_7.jpg' },
      { ProductID: 8, CategoryID: '1', name: 'Produkt_8', price: 250.99, description: 'Opis', warranty: '1 leto', specification: 'Specifikacije', manufacturer_url:'https://www.somelink.com', img_url:'assets/img/product_8.jpg' },
      { ProductID: 9, CategoryID: '1', name: 'Produkt_9', price: 250.99, description: 'Opis', warranty: '1 leto', specification: 'Specifikacije', manufacturer_url:'https://www.somelink.com', img_url:'assets/img/product_9.jpg' },
    ];

    const collectionRef = this.afs.collection('Product');
    products.forEach((Product) => {
      collectionRef.doc(Product.ProductID.toString()).set(Product)
        .then(() => console.log(`Produkt ${Product.name} uspešno dodan!`))
        .catch((error) => console.error('Napaka pri dodajanju produkta:', error));
    });
  }

  getProducts(): Observable<Product[]> {
    return this.afs.collection<Product>('Product').valueChanges();

  }

  getProductById(productId: number): Observable<any> {
    return this.afs.collection('Product', (ref) => ref.where('ProductID', '==', productId)).valueChanges();
  }
  
  getProductsByCategory(categoryId: number): Observable<any> {
    return this.afs.collection('Product', (ref) => ref.where('CategoryID', '==',categoryId)).valueChanges();
  }
}

