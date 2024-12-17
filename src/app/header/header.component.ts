import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

   countryCodeGB="gb";
   countryCodeDE="de";
   countryCodeSI="si";
   

   constructor( private auth : AuthService){}

      
   get isLoggedIn():boolean
   {
     return this.auth.isLoggedIn();
   }   
   logout()
   {
     this.auth.logout();
   } 
   
  }
