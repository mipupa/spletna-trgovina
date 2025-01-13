import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


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
export class GuestCartService {
  private localStorageKey = 'guestCart'; // Key for guest cart storage
  private guestProductsCountSubject = new BehaviorSubject<number>(0);

  constructor() {}

  
  // Add a product to the cart
  public addProductToCart(productId: number, quantity: number): void {
    const cart = this.getGuestCart();
    const updatedCartItems = { ...cart.cartItems };
    updatedCartItems[productId] = (updatedCartItems[productId] || 0) + quantity;
    const updatedCart = { ...cart, cartItems: updatedCartItems };
    this.setGuestCart(updatedCart);
    console.log('Updated Guest Cart:', updatedCart); // Log the updated cart
  }

  // Store the guest cart in localStorage
  private setGuestCart(cartData: Cart): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(cartData));
    console.log('Local Storage Content:', localStorage.getItem(this.localStorageKey)); // Log localStorage content
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

  // Generate a random UID for guests
  private generateRandomUid(): string {
    return Math.random().toString(36).substr(2, 9);
  }

    //metoda za pridobivanje trenutnega števila izdelkov v košarici za gosta
    // za namen prikaza števila produktov v header komponenti (ikona košarica)!
    public getGuestCartItemsCount(): Observable<number> {
      // Pridobi guestCart iz localStorage
      const guestCart = localStorage.getItem('guestCart');
      let count = 0;
  
      if (guestCart) {
        try {
          // Parsiraj JSON v objekt
          const cartData = JSON.parse(guestCart);
          // Preštej število ključev v cartItems
          count = Object.keys(cartData.cartItems || {}).length;
        } catch (error) {
          console.error('Napaka pri parsiranju guestCart:', error);
        }
      }
      
      // Vrni število kot Observable
      return of(count);
    }
  }
  
