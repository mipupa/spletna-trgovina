import { Component, OnInit } from '@angular/core';
import { PoslovalniceService} from '../services/poslovalnice.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-poslovalnice',
  templateUrl: './poslovalnice.component.html',
  styleUrl: './poslovalnice.component.css'
})
export class PoslovalniceComponent implements OnInit {

  poslovalnice: any[] = [];  // Seznam poslovalnic
  zoom: number = 15;  // Začetni nivo povečave
  marker: any;  // En marker za posamezno poslovalnico
  notifications: {[key: number]: any[] } = {}; //za obvestila poslovalnic

  ngOnInit() {
    this.pridobiPoslovalnice();

    const savedLang = localStorage.getItem('language');
    if(savedLang) {
      this.translate.use(savedLang);
    }
  }

  constructor(private poslovalniceService: PoslovalniceService, private translate: TranslateService) {
    this.translate.setDefaultLang('sl');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|de/) ? browserLang : 'sl');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  pridobiPoslovalnice(): void {
    this.poslovalniceService.getBranches().subscribe({
      next: (data) => {
        console.log('Pridobljene poslovalnice:', data);
        this.poslovalnice = data;
        this.getNotifications(); //pridobi obvestila za posamezno poslovalnico
        this.postaviMarkerje();  // Nastavimo marker za prvo poslovalnico
      },
      error: (err) => {
        console.error('Napaka pri pridobivanju poslovalnic:', err);
      },
    });
    
  }

  getNotifications():void {
    this.poslovalnice.forEach((Branch) => {
      this.poslovalniceService.getNotificationsByBranch(Branch.BranchID).subscribe((notifications)=> {
        this.notifications[Branch.BranchID] = notifications;
        
      } )
    })
  }

  postaviMarkerje(): void {
    // Ustvarim marker za prvo poslovalnico, ki ga bom prikazal na zemljevidu
    if (this.poslovalnice.length > 0) {
      const prviPoslovalnica = this.poslovalnice[0];  // Lahko spremenite, če želite drugačno poslovalnico
      this.marker = {
        position: { lat: prviPoslovalnica.loc_lat, lng: prviPoslovalnica.loc_lng },
        title: prviPoslovalnica.name
      };
    }
  }

 

}

