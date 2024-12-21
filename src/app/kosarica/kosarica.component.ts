import { Component, OnInit, ViewChild  } from '@angular/core';
import { KosaricaService } from '../services/kosarica.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-kosarica',
  templateUrl: './kosarica.component.html',
  styleUrls: ['./kosarica.component.css'], // Corrected `styleUrl` to `styleUrls`
})
export class KosaricaComponent {

  productsInCart: any[] = [];
  totalPrice: number = 0; // Total price of products
  totalWithShipping: number = 0; // Total price including shipping
  isLoading: boolean = true;
  errorMessage: string | null = null;
  shippingOption: string = "standard";
  paymentOption: string = "creditCard";
  shipingCost: number = 0;
  vatRate: number = 0.22; // VAT rate, for example 22%
  totalVAT: number = 0; // VAT value

  constructor(
    private auth: AuthService,
    private kosaricaService: KosaricaService
  ) {
    this.fetchCartItems();

  }

  fetchCartItems(): void {
    this.isLoading = true;
    this.kosaricaService.getProductsInCart().subscribe({
      next: (products) => {
        this.productsInCart = products;
        this.calculateTotalPrice();
        this.updateTotalWithShipping();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching cart items: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.productsInCart.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    this.calculateVAT(); // Recalculate VAT whenever the total price changes

  }

  updateTotalWithShipping(): void {
    const shippingCost = this.getShippingCost();
    this.totalWithShipping = this.totalPrice + shippingCost;
    console.log('Total with shipping:', this.totalWithShipping);
    this.calculateVAT(); // Recalculate VAT whenever shipping changes

  }

  getShippingCost(): number {
    // This will use the updated `shippingOption` as a number
    return this.shippingOption === "standard" ? 5 : 10; // No need for additional checks, since it's already a number
  }

  updateShippingOption(value: string): void {
    // Update shippingOption and recalculate total with new shipping cost
    console.log('Selected shipping option:', value);
    this.shippingOption = value;
    console.log('Updated shipping option:', this.shippingOption);
    this.updateTotalWithShipping();
  }


  removeFromCart(productId: number): void {
    this.kosaricaService.removeProductFromCart(productId).then(() => {
      this.productsInCart = this.productsInCart.filter(
        (p) => p.ProductID !== productId
      );
      this.calculateTotalPrice();
      this.updateTotalWithShipping();
    }).catch((error) => {
      this.errorMessage = 'Error removing item: ' + error.message;
    });
  }

  increaseQuantity(productId: number): void {
    this.kosaricaService.addProductToCart(productId, 1).then(() => {
      const product = this.productsInCart.find((p) => p.ProductID === productId);
      if (product) {
        product.quantity++;
      }
      this.calculateTotalPrice();
      this.updateTotalWithShipping();
    });
  }

  decreaseQuantity(productId: number, quantity: number): void {
    if (quantity === 1) {
      this.removeFromCart(productId);
    } else {
      this.kosaricaService.addProductToCart(productId, -1).then(() => {
        const product = this.productsInCart.find(
          (p) => p.ProductID === productId
        );
        if (product) {
          product.quantity--;
        }
        this.calculateTotalPrice();
        this.updateTotalWithShipping();
      });
    }
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  getGuestCart(): any[] {
    const guestCart = localStorage.getItem('guestCart');
    return guestCart ? JSON.parse(guestCart) : [];
  }
  onSelectionChange() {
    // Update the displayed number whenever the dropdown selection changes
    this.shipingCost = this.shippingOption === "standard" ? 5 : 10 ;
    console.log('Selected shipping cost:', this.shipingCost);
    this.updateTotalWithShipping();

  }
  calculateVAT(): void {
    this.totalVAT = this.totalPrice * this.vatRate;
  }

  submitOrder() {
    alert("Order submited!")
}
}

