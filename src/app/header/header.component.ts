import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { KosaricaService } from '../services/kosarica.service';
import { GuestCartService } from '../services/guest-cart.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';


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

  constructor(private auth: AuthService, private themeService: ThemeService, 
    private kosarica: KosaricaService, public guestCart: GuestCartService, 
    private translate: TranslateService, private toastr: ToastrService) {
    this.translate.setDefaultLang('sl');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|de/) ? browserLang : 'sl');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
  logout() {
    this.auth.logout();
    this.toastr.success('Uspešno ste se odjavili.')   
    
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

    const savedLang = localStorage.getItem('language');
    if(savedLang) {
      this.translate.use(savedLang);
    }

    //metoda za prikazovanje števila izdelkov/produktov v košarici (ikona košarica)
    this.kosarica.getTrenutnoStanje().subscribe(count => { this.productsCount = count; })
   
      this.guestCart.getGuestCartItemsCount().subscribe(count => { this.guestProductsCount = count; })
    }

 }


