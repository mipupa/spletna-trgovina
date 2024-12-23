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
}