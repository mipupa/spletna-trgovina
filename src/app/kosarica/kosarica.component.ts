import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KosaricaService} from '../services/kosarica.service';
import { UserDataService } from '../services/user-data.service';
import { UserData } from '../model/user-data';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-kosarica',
  templateUrl: './kosarica.component.html',
  styleUrl: './kosarica.component.css'
})
export class KosaricaComponent {
  productsInCart: any[] = [];
  totalPrice: number = 0;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private kosaricaService: KosaricaService) {   
     this.fetchCartItems();
  }

  fetchCartItems(): void {
    this.isLoading = true;
    this.kosaricaService.getProductsInCart().subscribe({
      next: (products) => {
        console.log(products);
        this.productsInCart = products;
        this.calculateTotalPrice();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching cart items: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.productsInCart.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }

  removeFromCart(productId: number): void {
    this.kosaricaService.removeProductFromCart(productId).then(() => {
      this.productsInCart = this.productsInCart.filter(p => p.id !== productId);
      this.calculateTotalPrice();
    }).catch(error => {
      this.errorMessage = 'Error removing item: ' + error.message;
    });
  }

  increaseQuantity(productId: number): void {
    console.log("povecujem ProductId: " + productId);
    this.kosaricaService.addProductToCart(productId, 1)
  }

  decreaseQuantity(productId: number, quantity: number): void {
    console.log("zmanjsujem ProductId: " + productId);
    if(quantity === 1) this.kosaricaService.removeProductFromCart(productId)
    else{
    this.kosaricaService.addProductToCart(productId, -1)
  }
  }
}