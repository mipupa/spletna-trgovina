import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, forkJoin, from } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Product } from '../model/product';
import { catchError } from 'rxjs/operators';

interface CartItem {
  [key: string]: number; // productId: quantity
}

interface Cart {
  uid: string;
  cartItems: CartItem;
}

@Injectable({
  providedIn: 'root'
})
export class KosaricaService {
  private cartCollection = this.afs.collection('cart');
  private productsCollection = this.afs.collection('Product');

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  // Fetch user's cart data
  getCartData(): Observable<Cart> {
    return this.afAuth.user.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          console.log("get cart data posilja uid: ", user.uid);
          return this.cartCollection.doc(user.uid).valueChanges() as Observable<Cart>;
        } else {
          throw new Error('User not logged in');
        }
      })
    );
  }
  // Update the cart in Firestore
  updateCart(cartData: Cart): Promise<void> {
    return this.afAuth.user.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this.cartCollection.doc(user.uid).set(cartData, { merge: true });
        } else {
          throw new Error('User not logged in');
        }
      })
    ).toPromise();
  }

  // Add a product to the cart
  addProductToCart(productId: number, quantity: number): Promise<void> {
    return this.getCartData().pipe(
      take(1),
      switchMap(cartData => {
        if (cartData) {
          const updatedCartItems = { ...cartData.cartItems };
          updatedCartItems[productId] = (updatedCartItems[productId] || 0) + quantity;
          return this.updateCart({ uid: cartData.uid, cartItems: updatedCartItems });
        } else {
          return this.afAuth.user.pipe(
            take(1),
            switchMap(user => {
              if (user) {
                return this.updateCart({
                  uid: user.uid,
                  cartItems: { [productId]: quantity }
                });
              } else {
                throw new Error('User not logged in');
              }
            })
          );
        }
      })
    ).toPromise();
  }

  // Remove a product from the cart
  removeProductFromCart(productId: number): Promise<void> {
    return this.afAuth.user.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          // Get the cart data for the current user
          const cartRef = this.cartCollection.doc(user.uid);

          return cartRef.get().pipe(
            switchMap(doc => {
              const cartData = doc.data() as Cart;
              if (cartData && cartData.cartItems) {
                const updatedCartItems = { ...cartData.cartItems };
                delete updatedCartItems[productId];  // Remove the product from the map

                // Update the cart with the new cartItems map
                return cartRef.update({
                  cartItems: updatedCartItems,
                });
              } else {
                throw new Error('Cart data not found');
              }
            })
          );
        } else {
          throw new Error('User not logged in');
        }
      })
    ).toPromise();
  }


  // Fetch all products in the cart with details
  getProductsInCart(): Observable<any[]> {
    return this.getCartData().pipe(
      switchMap(cartData => {
        if (cartData) {
          const productIds = Object.keys(cartData.cartItems);
          if (productIds.length === 0) {
            return []; // Return empty array if no products in cart
          }

          // Create an observable for each product fetch and combine them
          const productObservables = productIds.map(productId =>
            this.productsCollection.doc(productId).get().pipe(
              map(doc => {
                const product = doc.data() as Product;
                const quantity = cartData.cartItems[productId];
                return { ...product, quantity }; // Add quantity to product object
              }) // Handle potential errors in fetching products
            )
          );

          // Combine all product observables into a single array of products
          return forkJoin(productObservables).pipe(
            map(products => products.filter(product => product !== null)) // Filter out any null results
          );
        }else {
          throw new Error('Cart data not found');
        }
      })
    );
  }
  // Calculate the total price of the cart
  calculateTotalPrice(): Observable<number> {
    return this.getProductsInCart().pipe(
      map(products => {
        return products.reduce((total, product) => {
          return total + product.price * product.quantity;
        }, 0);
      })
    );
  }

  private generateRandomUid(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

