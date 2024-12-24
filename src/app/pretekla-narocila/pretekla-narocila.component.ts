import { Component, OnInit } from '@angular/core';
import { OrdersService, Order } from '../services/orders.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pretekla-narocila',
  templateUrl: './pretekla-narocila.component.html',
  styleUrl: './pretekla-narocila.component.css'
})
export class PreteklaNarocilaComponent {

  orders$: Observable<Order[]>;

  constructor(private ordersService: OrdersService) {
    this.orders$ = this.ordersService.getOrders();
  }

  //funkcija za formatiranje cene iz FireBase namreč prileti number
  formatCurrency(value: number, locale: string='sl-SI', currency: string = 'EUR'):string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }
  
}