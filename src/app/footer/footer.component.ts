import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private translate: TranslateService) {
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
}
