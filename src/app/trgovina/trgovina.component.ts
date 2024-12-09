import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product';

@Component({
  selector: 'app-trgovina',
  templateUrl: './trgovina.component.html',
  styleUrl: './trgovina.component.css'
})
export class TrgovinaComponent implements OnInit {

  constructor(private categoryService:CategoryService, private productService:ProductService) {}
  categories: Category[] = [];
  products: Product[] = [];
    
  ngOnInit(){
  
    //metoda samo za prvo kreiranje kategorij 
    //this.categoryService.addCategories();

    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });

    //metoda samo za prvo kreiranje produktov
    //this.productService.addProducts();

    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    })
   };
   
  //funkcija za formatiranje cene iz FireBase namreč prileti number
  formatCurrency(value: number, locale: string='sl-SI', currency: string = 'EUR'):string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }

}
