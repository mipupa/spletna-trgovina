import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { KosaricaService } from '../services/kosarica.service';
import { GuestCartService } from '../services/guest-cart.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  countryCodeGB = "gb";
  countryCodeDE = "de";
  countryCodeSI = "si";
  productsCount: number = 0;
  guestProductsCount: number = 0;

  constructor(private auth: AuthService, private themeService: ThemeService, private kosarica: KosaricaService, public guestCart: GuestCartService) { }


  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
  logout() {
    this.auth.logout();
  }

  themes = ['dark-theme', 'light-theme'];
  selectedTheme = 'light-theme'; // Privzeta tema

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

    //metoda za prikazovanje števila izdelkov/produktov v košarici (ikona košarica)
    this.kosarica.getTrenutnoStanje().subscribe(count => { this.productsCount = count; })
   
      this.guestCart.getGuestCartItemsCount().subscribe(count => { this.guestProductsCount = count; })
    }

 }


