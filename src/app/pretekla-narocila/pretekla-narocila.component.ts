import { Component, OnInit } from '@angular/core';
import { OrdersService, Order } from '../services/orders.service';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pretekla-narocila',
  templateUrl: './pretekla-narocila.component.html',
  styleUrl: './pretekla-narocila.component.css'
})
export class PreteklaNarocilaComponent {

  orders$: Observable<Order[]>;

  constructor(private ordersService: OrdersService, private translate: TranslateService) {
    this.orders$ = this.ordersService.getOrders();
    this.translate.setDefaultLang('sl');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|de/) ? browserLang : 'sl');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('language');
    if(savedLang) {
      this.translate.use(savedLang);
    }
  }

  //funkcija za formatiranje cene iz FireBase namreč prileti number
  formatCurrency(value: number, locale: string='sl-SI', currency: string = 'EUR'):string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }
  
}