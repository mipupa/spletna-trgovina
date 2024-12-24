import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Product } from '../model/product';


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
  private localStorageKey = 'guestCart'; // Key for guest cart storage
  
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  //metoda za pridobivanje trenutnega števila izdelkov v košarici za trenutno prijavljenega
  // uporabnika za namen prikaza števila produktov v header komponenti (ikona košarica)!
  getTrenutnoStanje(): Observable<number> {
    const uid = localStorage.getItem('token'); // Pridobi uid iz localStorage

    if (!uid) {
      return of(0); // Če uid ni nastavljen, vrni 0
    }
  
    console.log('UID:', uid); // Debug UID
    return this.afs
      .collection('cart', ref => ref.where('uid', '==', uid)) // Filtriraj po `uid`
      .valueChanges()
      .pipe(
        map((documents: any[]) => {
          console.log('Cart Documents:', documents); // Debug dokumenti v Firestore-u
  
          if (documents.length === 0) return 0; // Če ni dokumentov, vrni 0
  
          const cartItems = documents[0]?.cartItems;
  
          // Če cartItems ni array, preštej elemente direktno iz objekta
          if (typeof cartItems === 'object') {
            console.log('cartItems as object:', cartItems); // Debug izpis objekta
            return Object.values(cartItems).reduce((total: number, item: any) => total + (item || 0), 0); // Preštej vse elemente objekta
          }
  
          console.log('cartItems as array:', cartItems); // Debug za array
          return cartItems.reduce((total: number, item: any) => total + (item.quantity || 0), 0); // Če je array, preštej elemente
        })
      );
  }
  
  

  // Fetch user's cart data (Support for both authenticated and guest users)
  getCartData(): Observable<Cart> {
    return this.afAuth.user.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          // For logged-in users, fetch the cart from Firestore
          return this.cartCollection.doc(user.uid).valueChanges() as Observable<Cart>;
        } else {
          // For guests, fetch the cart from localStorage
          const cart = this.getGuestCart();
          return of(cart);
        }
      })
    );
  }

  // Update the cart in Firestore for logged-in users or in localStorage for guests
  updateCart(cartData: Cart): Promise<void> {
    return this.afAuth.user.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          // For logged-in users, update cart in Firestore
          return this.cartCollection.doc(user.uid).set(cartData, { merge: true });
        } else {
          // For guests, fetch the cart from localStorage
          const cart = this.getGuestCart();
          return of(cart).pipe(map(() => void 0));
        }
      })
    ).toPromise();
  }

  // Add a product to the cart (Support for both authenticated and guest users)
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
                const guestCart = this.getGuestCart();
                const updatedCartItems = { ...guestCart.cartItems };
                updatedCartItems[productId] = (updatedCartItems[productId] || 0) + quantity;
                const updatedGuestCart = { ...guestCart, cartItems: updatedCartItems };
                console.log("to kar bomo settali", updatedGuestCart);
                this.setGuestCart(updatedGuestCart); // Store updated cart in localStorage
                return Promise.resolve(); // Return a resolved promise with void
              }
            })
          );
        }
      })
    ).toPromise();
  }
  

  // Remove a product from the cart (Support for both authenticated and guest users)
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
                }).then(() => {
                  return Promise.resolve(); // Ensures returning a resolved promise with void
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
  

  // Fetch all products in the cart with details (Support for both authenticated and guest users)
  getProductsInCart(): Observable<any[]> {
    return this.afAuth.user.pipe(
      switchMap(user => {
        // If the user is logged in
        if (user) {
          return this.cartCollection.doc<Cart>(user.uid).valueChanges().pipe( // Explicitly type valueChanges() here
            switchMap((cartData: Cart | undefined) => {
              if (cartData) {
                const productIds = Object.keys(cartData.cartItems);
                if (productIds.length === 0) {
                  return of([]); // Return empty array if no products in cart
                }
  
                // Fetch product details from Firestore for each product ID
                const productObservables = productIds.map(productId =>
                  this.productsCollection.doc(productId).get().pipe(
                    map(doc => {
                      const product = doc.data() as Product;
                      const quantity = cartData.cartItems[productId];
                      return { ...product, quantity }; // Add quantity to product object
                    })
                  )
                );
  
                // Combine all product observables into a single array of products
                return forkJoin(productObservables).pipe(
                  map(products => products.filter(product => product !== null))
                );
              } else {
                return of([]); // Return empty array if no cart data
              }
            })
          );
        } else {
          // If the user is a guest, get cart from localStorage/sessionStorage
          const guestCart = this.getGuestCart();
          console.log("guest cart ", guestCart);
          const productIds = Object.keys(guestCart.cartItems);
          if (productIds.length === 0) {
            return of([]); // Return empty array if no products in cart
          }
  
          // Create an observable for each product fetch for the guest cart
          const productObservables = productIds.map(productId =>
            this.productsCollection.doc(productId).get().pipe(
              map(doc => {
                const product = doc.data() as Product;
                const quantity = guestCart.cartItems[productId];
                return { ...product, quantity }; // Add quantity to product object
              })
            )
          );
  
          // Combine all product observables into a single array of products for guests
          return forkJoin(productObservables).pipe(
            map(products => products.filter(product => product !== null))
          );
        }
      })
    );
  }


  // Calculate the total price of the cart (Support for both authenticated and guest users)
  calculateTotalPrice(): Observable<number> {
    return this.getProductsInCart().pipe(
      map(products => {
        return products.reduce((total, product) => total + product.price * product.quantity, 0);
      })
    );
  }

  // Generate a random UID for guests
  private generateRandomUid(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Store the guest cart in localStorage
  private setGuestCart(cartData: Cart): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(cartData));
  }

  // Get the guest cart from localStorage
  private getGuestCart(): Cart {
    const cartData = localStorage.getItem(this.localStorageKey);
    if (cartData) {
      return JSON.parse(cartData) as Cart;
    } else {
      return { uid: this.generateRandomUid(), cartItems: {} };
    }
  }

 

//metoda za ustvarjanje naročil registriranega/prijavljenega uporabnika
createOrder(cenaDostave:number): void {
  const uid = localStorage.getItem('token'); // Pridobi trenutni UID
  if (!uid) {
    console.error('UID ni nastavljen!');
    return;
  }

  // Pridobitev košarice za trenutnega UID iz Firestore
  this.afs
    .collection('cart', ref => ref.where('uid', '==', uid))
    .valueChanges()
    .pipe(take(1))
    .subscribe((cartDocuments: any[]) => {
      if (cartDocuments.length === 0) {
        console.error('Košarica je prazna ali ne obstaja!');
        return;
      }

      const cart = cartDocuments[0];
      const cartItems = cart.cartItems;
      

      if (!cartItems || Object.keys(cartItems).length === 0) {
        console.error('Košarica je prazna!');
        return;
      }

      // Pridobitev vseh izdelkov iz kolekcije Product
      this.afs.collection('Product').valueChanges({ idField: 'id' }).pipe(take(1)).subscribe((products: any[]) => {
        const orderItems = Object.keys(cartItems).map(productId => {
          const product = products.find(p => p.id === productId);

          if (!product) {
            console.error(`Izdelek z ID ${productId} ni bil najden v Products.`);
            return null;
          }

          const quantity = Object.values(cartItems).reduce((total: number, item: any) => (item || 0), 0);

          return {
            productId,
            name: product.name || 'Neznan izdelek', // Naziv izdelka
            price: product.price || 0, // Cena izdelka
            quantity, // Količina iz košarice
          };
        }).filter(item => item !== null);

        if (orderItems.length === 0) {
          console.error('Košarica ne vsebuje veljavnih izdelkov.');
          return;
        }

        const orderData = {
          uid,
          orderNumber: this.generateUniqueOrderNumber(),
          status: 'V obdelavi', // Status naročila
          items: orderItems, // Predmeti iz košarice
          orderDate: new Date(), // Datum naročila
          totalPrice: this.calculateTotal(orderItems)+ cenaDostave, // Izračun skupne cene z dostavo
        };

        // Shranjevanje naročila v Firestore
        this.afs.collection('Orders').add(orderData)
          .then(() => {
            //console.log('Naročilo je bilo uspešno shranjeno!');
            
            // Po uspešnem shranjevanju izprazni košarico
            this.clearCart(uid);
          })
          .catch(error => {
            console.error('Napaka pri shranjevanju naročila:', error);
          });
      });
    });
}

// Metoda za generiranje unikatne številke naročila
private generateUniqueOrderNumber(): string {
  return 'N-' + Date.now().toString();
}

// Metoda za izračun skupne cene naročila
private calculateTotal(orderItems: any[]): number {
  return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Metoda za brisanje košarice
private clearCart(uid: string): void {
  this.afs.collection('cart', ref => ref.where('uid', '==', uid))
    .get()
    .pipe(take(1))
    .subscribe(snapshot => {
      snapshot.forEach(doc => {
        doc.ref.delete().then(() => console.log('Košarica je izbrisana.'));
        
      });
    });
}
}











