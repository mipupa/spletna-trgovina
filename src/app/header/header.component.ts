import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

   countryCodeGB="gb";
   countryCodeDE="de";
   countryCodeSI="si";
   

   constructor( private auth : AuthService, private themeService: ThemeService){}

      
   get isLoggedIn():boolean
   {
     return this.auth.isLoggedIn();
   }   
   logout()
   {
     this.auth.logout();
   } 

   themes = ['original-theme', 'dark-theme', 'light-theme'];
   selectedTheme = 'original-theme'; // Privzeta tema

   changeTheme(): void {
    const currentIndex = this.themes.indexOf(this.selectedTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.selectedTheme = this.themes[nextIndex];
    this.themeService.setTheme(this.selectedTheme);
    localStorage.setItem('selectedTheme', this.selectedTheme);
  }
  
   ngOnInit(): void {
    const storedTheme = localStorage.getItem('selectedTheme') || this.selectedTheme;
    this.selectedTheme = storedTheme;
    this.themeService.setTheme(this.selectedTheme);
  }

  }
