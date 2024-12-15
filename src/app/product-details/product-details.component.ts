import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { KosaricaService } from '../services/kosarica.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  product: any = null;
  categoryId: number | null = null;
  productId: number | null = null;

  //funkcija za formatiranje cene iz FireBase namreč prileti number
  formatCurrency(value: number, locale: string='sl-SI', currency: string = 'EUR'):string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }

  constructor(private kosaricaService: KosaricaService, private route: ActivatedRoute, private productService: ProductService) {}

  /*ngOnInit(): void {
    // Pridobi `productId` iz URL-ja
        // Pridobi parametra iz URL-ja
        this.categoryId = +this.route.snapshot.paramMap.get('CategoryID')!;
        this.productId = +this.route.snapshot.paramMap.get('ProductID')!;
    // Naloži podatke za produkt
    if (this.productId) {
      this.loadProductDetails(this.productId);
    }
  }

  loadProductDetails(productId: number): void {
    this.productService.getProductById(productId).subscribe(
      (products) => {
        if (products.length > 0) {
          this.product = products[0];
          console.log('Produkt najden:', this.product);
        } else {
          console.warn('Produkt z ID ni bil najden.');
        }
      },
      (error) => {
        console.error('Napaka pri pridobivanju produkta:', error);
      }
    );
  } */

    async ngOnInit(): Promise<void> {
      // Pridobi parametra iz URL-ja
      this.categoryId = +this.route.snapshot.paramMap.get('CategoryID')!;
      this.productId = +this.route.snapshot.paramMap.get('ProductID')!;
  
      console.log('Pridobljen CategoryID:', this.categoryId);
      console.log('Pridobljen ProductID:', this.productId);
  
      // Naloži podatke za produkt
      if (this.productId) {
        await this.loadProductDetails(this.productId);
      }
    }
  
    // Posodobljena metoda za asinhrono nalaganje produkta z uporabo firstValueFrom
    async loadProductDetails(productId: number): Promise<void> {
      try {
        const products = await firstValueFrom(this.productService.getProductById(productId));
        if (products.length > 0) {
          this.product = products[0];
          console.log('Produkt najden:', this.product);
        } else {
          console.warn('Produkt z ID ni bil najden.');
        }
      } catch (error) {
        console.error('Napaka pri pridobivanju produkta:', error);
      }
    }

    addProductToCart(productId: number): void {
      this.kosaricaService.addProductToCart(productId);
    }  
  }

