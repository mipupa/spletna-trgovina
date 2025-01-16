import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { KosaricaService } from '../services/kosarica.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GuestCartService } from '../services/guest-cart.service';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(  private authService: AuthService, private guestCartService: GuestCartService,
    private router: Router, private kosaricaService: KosaricaService, private route: ActivatedRoute, private productService: ProductService, private translate: TranslateService) {
      this.translate.setDefaultLang('sl');
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang?.match(/en|de/) ? browserLang : 'sl');
    }
  
  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

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
  
      const savedLang = localStorage.getItem('language');
      if(savedLang) {
        this.translate.use(savedLang);
      }

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

    addToCartAndRedirect(productId: number): void {
      if (this.authService.isLoggedIn()) {
        this.kosaricaService.addProductToCart(productId, 1)
          .then(() => {
            this.router.navigate(['/cart']); // Preusmeritev na stran s košarico
          })
          .catch(error => {
            console.error('Napaka pri dodajanju v košarico:', error);
            alert('Napaka pri dodajanju v košarico.');
          });
      } else {
        this.guestCartService.addProductToCart(productId, 1);
        this.router.navigate(['/guest-cart']); // Preusmeritev na stran za goste
      }
    }
  
  }

