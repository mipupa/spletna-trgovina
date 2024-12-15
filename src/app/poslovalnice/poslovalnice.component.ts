import { Component, OnInit } from '@angular/core';
import { PoslovalniceService} from '../services/poslovalnice.service';

@Component({
  selector: 'app-poslovalnice',
  templateUrl: './poslovalnice.component.html',
  styleUrl: './poslovalnice.component.css'
})
export class PoslovalniceComponent implements OnInit {

  ngOnInit() {
    this.pridobiPoslovalnice();
    this.saveData();
  }



  poslovalnice: any[] = [];  // Seznam poslovalnic
  zoom: number = 15;  // Začetni nivo povečave
  marker: any;  // En marker za posamezno poslovalnico

  constructor(private poslovalniceService: PoslovalniceService) {}

  pridobiPoslovalnice(): void {
    this.poslovalniceService.getBranches().subscribe({
      next: (data) => {
        console.log('Pridobljene poslovalnice:', data);
        this.poslovalnice = data;
        this.postaviMarkerje();  // Nastavimo marker za prvo poslovalnico
      },
      error: (err) => {
        console.error('Napaka pri pridobivanju poslovalnic:', err);
      },
    });
  }

  postaviMarkerje(): void {
    // Ustvarimo marker za prvo poslovalnico, ki ga bomo prikazali na zemljevidu
    if (this.poslovalnice.length > 0) {
      const prviPoslovalnica = this.poslovalnice[0];  // Lahko spremenite, če želite drugačno poslovalnico
      this.marker = {
        position: { lat: prviPoslovalnica.loc_lat, lng: prviPoslovalnica.loc_lng },
        title: prviPoslovalnica.name
      };
    }
  }

  
  saveData() {
    const collectionName = '';
    const documentId = '';
    const data = {
      name: 'John Doe',
      age: 30,
      profession: 'Developer'
    };

    this.poslovalniceService.saveDataToDocument(collectionName, documentId, data).subscribe({
      next: () => {
        console.log('Data saved successfully!');
      },
      error: (error) => {
        console.error('Error saving data:', error);
      }
    });
  }
}

