import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product';
import { SearchService } from '../services/search.service';
import { KosaricaService } from '../services/kosarica.service'; // Uredi pot
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GuestCartService } from '../services/guest-cart.service';
@Component({
  selector: 'app-trgovina',
  templateUrl: './trgovina.component.html',
  styleUrl: './trgovina.component.css',
})
export class TrgovinaComponent implements OnInit {
  //Trenutna stran in število produktov na stran
  currentPage = 0;
  itemsPerPage = 6;
  sortOrder: string | null = null; //ni nastavljen privzeti filter
  searchTerm: string ='';

  constructor( private authService: AuthService, private guestCartService: GuestCartService,
    private router: Router, private categoryService: CategoryService,private productService: ProductService, private searchService: SearchService, private kosaricaService: KosaricaService  ) { }

  categories: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  ngOnInit():void {
    //metoda samo za prvo kreiranje kategorij
    //this.categoryService.addCategories();

    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });

    //metoda samo za prvo kreiranje produktov
    //this.productService.addProducts();

    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.filteredProducts = [...this.products];
      this.applyFilters();
    });
    this.filterProducts();   
  }

   onInputSearch():void { 
    this.applyFilters();   
    this.filterProducts();    
   }
    

    private filterProducts(): void {
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    this.filteredProducts=this.products.filter((product) =>
    product.name.toLowerCase().includes(lowerCaseTerm));
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

  //vedno scrollaj na vrh pri kliku na drugo stran
  onPageChange(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSortChange(sortOrder: string): void {
    this.sortOrder = sortOrder;
    this.applyFilters();
  }
  applyFilters(): void {
    //vedno začni z celotnim seznamom produktov za pravilno filtriranje produktov
    this.filteredProducts = [...this.products];
    

    if (this.sortOrder === 'asc') {
      this.filteredProducts.sort((a, b) => a.price - b.price); // Cena naraščajoče
    } else if (this.sortOrder === 'desc') {
      this.filteredProducts.sort((a, b) => b.price - a.price); // Cena padajoče
    } else if (this.sortOrder === 'nameAsc') {
      this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); // Abecedno A-Z
    } else if (this.sortOrder === 'nameDesc') {
      this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name)); // Abecedno Z-A
    } else if (this.sortOrder === 'inStock') {
      this.filteredProducts = this.filteredProducts.filter(
        (product) => product.inStock === true
      ); // Filtriranje po zalogi (na voljo)
    } else if (this.sortOrder === 'outOfStock') {
      this.filteredProducts = this.filteredProducts.filter(
        (product) => product.inStock === false
      ); // Filtriranje po zalogi (ni na voljo)
    } else {
      this.filteredProducts = [...this.products]; //Ponastavi privzeto stanje
    }
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
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