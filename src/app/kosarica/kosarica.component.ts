import { Component} from '@angular/core';
import { KosaricaService } from '../services/kosarica.service';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-kosarica',
  templateUrl: './kosarica.component.html',
  styleUrls: ['./kosarica.component.css'], // Corrected `styleUrl` to `styleUrls`
})
export class KosaricaComponent {

  categories: any[] = [];
  productsInCart: any[] = [];
  totalPrice: number = 0; // Total price of products
  totalWithShipping: number = 0; // Total price including shipping
  isLoading: boolean = true;
  errorMessage: string | null = null;
  shippingOption: string = "osebno"; //privzeta vrednost
  paymentOption: string = "poPovzetju"; //privzeta vrednost
  shipingCost: number = 0;
  vatRate: number = 0.22; // VAT rate, for example 22%
  totalVAT: number = 0; // VAT value
  

  constructor(
    private auth: AuthService, private categoryService: CategoryService, private route: Router, private toastr: ToastrService,
    private kosaricaService: KosaricaService
  ) {
    this.fetchCartItems();

  }

  fetchCartItems(): void {
    this.isLoading = true;
    this.kosaricaService.getProductsInCart().subscribe({
      next: (products) => {
        this.productsInCart = products;

        // Fetch category names for each product
        const categoryIds = products.map(product => product.CategoryID);
        this.categoryService.getCategoryNames(categoryIds).subscribe({
          next: (categoryNames) => {
            this.productsInCart = this.productsInCart.map(product => ({
              ...product,
              categoryName: categoryNames[product.CategoryID] // Add category name to each product
            }));

            this.calculateTotalPrice();
            this.updateTotalWithShipping();
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error fetching category names: ' + error.message;
            this.isLoading = false;
          }
        });
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
    switch (this.shippingOption) {
      case "standard":
        return 6;
      case "express":
        return 15;
      case "osebno":
        return 0;
      default:
        throw new Error(`Neznana možnost pošiljanja: ${this.shippingOption}`);
    }
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
  // Posodobi strošek pošiljanja na podlagi izbrane možnosti
  this.shipingCost = this.getShippingCost();

  // Prikaži trenutni strošek v konzoli
  console.log('Selected shipping cost:', this.shipingCost);

  // Posodobi skupni znesek z vključenim stroškom pošiljanja
  this.updateTotalWithShipping();
}
  
  calculateVAT(): void {
    this.totalVAT = this.totalPrice * this.vatRate;
  }

  //funkcija za formatiranje cene iz FireBase namreč prileti number
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

  submitOrder() {
     //kreiram naročilo
    this.kosaricaService.createOrder(this.shipingCost);

    // Prikaz toasterja s pozicioniranjem
    this.toastr.success('Naročilo uspešno oddano!');
    // Navigacija na stran naročil
    setTimeout(() => {
    this.route.navigate(['/narocila']);
  }, 3000); 
     
}

}

