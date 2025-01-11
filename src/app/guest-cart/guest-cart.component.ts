import { Component, OnInit } from '@angular/core';
import { GuestCartService } from '../services/guest-cart.service';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-guest-cart',
  templateUrl: './guest-cart.component.html',
  styleUrls: ['./guest-cart.component.css']
})
export class GuestCartComponent implements OnInit {
  products: Product[] = []; // Mock or fetched product list
  productsInCart: any[] = [];
  totalPrice: number = 0;
  totalVAT: number = 0;
  shippingCost: number = 0;
  isLoading: boolean = false;
  paymentOption: string = "poPovzetju"; //privzeta vrednost
  categories: any[] = [];
  totalWithShipping: number = 0; // Total price including shipping
  errorMessage: string | null = null;
  shippingOption: string = "osebno"; //privzeta vrednost
  shipingCost: number = 0;
  vatRate: number = 0.22; // VAT rate, for example 22%
  shippingInfo = { address: '', postalCode: '', city: '' }; // Shipping information
  displayForm: boolean = false;

  

  constructor(private cdr: ChangeDetectorRef, private guestCartService: GuestCartService,private productService: ProductService  ) {}

  ngOnInit(): void {
    this.loadProducts(); // First, load the products
    this.loadCart();
    this.calculateTotals();
    this.updateTotalWithShipping();

  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products; // Assign products to the array
        this.loadCart(); // Once products are loaded, load the cart
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
  
  onSelectionChange() {
    // Posodobi strošek pošiljanja na podlagi izbrane možnosti
    this.shipingCost = this.getShippingCost();
    this.cdr.detectChanges(); // Manually trigger change detection

    // Prikaži trenutni strošek v konzoli
    console.log('Selected shipping cost:', this.shipingCost);
  
    // Posodobi skupni znesek z vključenim stroškom pošiljanja
    this.updateTotalWithShipping();
  }
  // Load cart from localStorage
  private loadCart(): void {
    const cartData = this.getGuestCartData();
    console.log('Parsed Cart Data:', cartData); // Log parsed cart data
  
    // Check if products are loaded
    if (this.products && this.products.length > 0) {
      // Map cartItems to actual product objects
      this.productsInCart = Object.keys(cartData.cartItems).map(productId => {
        const product = this.products.find(p => p.ProductID === +productId); // Match by ID
        const quantity = cartData.cartItems[productId];
        return product ? { ...product, quantity } : null; // Add quantity if product exists
      }).filter(item => item !== null);
  
      console.log('Products in Cart:', this.productsInCart); // Log final mapped products
      this.calculateTotals();
      this.updateTotalWithShipping();
    } else {
      console.log('No products loaded yet!');
    }
  }
  
  
  // Add product to cart
  public addToCart(productId: number, quantity: number): void {
    this.guestCartService.addProductToCart(productId, quantity);
    this.loadCart();
    this.calculateTotals();
  }

  // Remove product from cart
  public removeFromCart(productId: number): void {
    const cartData = this.getGuestCartData();
    delete cartData.cartItems[productId];
    this.updateGuestCart(cartData);
    this.loadCart();
    this.calculateTotals();
  }

  // Calculate total price and VAT
  private calculateTotals(): void {
    this.totalPrice = this.productsInCart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    console.log('Total Price:', this.totalPrice);
    this.totalVAT = this.totalPrice * 0.22;
  }

  // Submit the order
  public submitOrder(): void {
    const orderData = {
      orderNumber: this.generateUniqueOrderNumber(),
      items: this.productsInCart,
      totalPrice: this.totalPrice + this.shippingCost,
      totalVAT: this.totalVAT,
      orderDate: new Date(),
      shippingInfo: this.shippingInfo,

    };

    console.log('Order submitted:', orderData);
    this.clearCart();
  }

  // Clear the cart
  private clearCart(): void {
    localStorage.removeItem('guestCart');
    this.loadCart();
    this.calculateTotals();
  }

  // Helper: Get cart data from localStorage
  private getGuestCartData() {
    const cartData = localStorage.getItem('guestCart');
    console.log('Raw Local Storage Content:', cartData); // Log raw localStorage data
    return cartData ? JSON.parse(cartData) : { uid: '', cartItems: {} };
  }
  

  // Helper: Update cart in localStorage
  private updateGuestCart(cartData: any): void {
    localStorage.setItem('guestCart', JSON.stringify(cartData));
  }

  // Helper: Generate a unique order number
  private generateUniqueOrderNumber(): string {
    return 'N-' + Date.now().toString();
  }

  formatCurrency(
    value: number,
    locale: string = 'sl-SI',
    currency: string = 'EUR'
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }

    // Increase product quantity
    public increaseQuantity(productId: number): void {
      const cartData = this.getGuestCartData();
      if (cartData.cartItems[productId]) {
        cartData.cartItems[productId]++;
        this.updateGuestCart(cartData);
        this.loadCart();
        this.calculateTotals();
        this.updateTotalWithShipping();

      }
    }
  
    // Decrease product quantity
    public decreaseQuantity(productId: number): void {
      const cartData = this.getGuestCartData();
      if (cartData.cartItems[productId]) {
        if (cartData.cartItems[productId] > 1) {
          cartData.cartItems[productId]--;
        } else {
          delete cartData.cartItems[productId];
        }
        this.updateGuestCart(cartData);
        this.loadCart();
        this.calculateTotals();
        this.updateTotalWithShipping();

      }
    }

    updateTotalWithShipping(): void {
      const shippingCost = this.getShippingCost();
      this.totalWithShipping = this.totalPrice + shippingCost;
      console.log('Total with shipping:', this.totalWithShipping);
      this.calculateVAT(); // Recalculate VAT whenever shipping changes
  
    }
  
    getShippingCost(): number {
      switch (this.shippingOption) {
        case "standard":
          this.displayForm = true
          return 7;
        case "express":
          this.displayForm = true
          return 15;
        case "osebno":
          this.displayForm = false;
          return 0;
        default:
          throw new Error(`Neznana možnost pošiljanja: ${this.shippingOption}`);
      }
    }

    
  calculateVAT(): void {
    this.totalVAT = this.totalPrice * this.vatRate;
  }
  submitShippingForm(): void {
    console.log('Shipping Info:', this.shippingInfo);
  }
}