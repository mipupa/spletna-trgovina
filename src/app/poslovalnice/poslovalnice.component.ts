import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { PoslovalniceService, Poslovalnica } from '../services/poslovalnice.service';
import { last } from 'rxjs';



interface MarkerProperties {
  position: {
    lat: number;
    lng: number;
  };
    title: string;
};


@Component({
  selector: 'app-poslovalnice',
  templateUrl: './poslovalnice.component.html',
  styleUrl: './poslovalnice.component.css'
})
export class PoslovalniceComponent implements OnInit {

  poslovalnice: Poslovalnica[] = [];
  
  markers: { position: google.maps.LatLngLiteral; title: string }[] = []; // Določimo pravilen tip za position

  constructor(private poslovalniceService: PoslovalniceService) {}

  ngOnInit(): void {
    this.pridobiPoslovalnice();
    
  }

  pridobiPoslovalnice(): void {
    this.poslovalniceService.getBranches().subscribe({
      next: (data) => {
        this.poslovalnice = data; // Shrani celoten seznam
       // Pretvori podatke poslovalnic v markerje
       const noviMarkerji = data.map((poslovalnica) => ({
        position: {
          lat: poslovalnica.loc_lat, 
          lng: poslovalnica.loc_lng, 
        },
        title: poslovalnica.name,
      }));

      

      // Dodaj nove markerje v seznam
      this.markers = [...this.markers, ...noviMarkerji];
      console.log('Vsi markerji:', this.markers);
    },
    error: (err) => {
      console.error('Napaka pri pridobivanju poslovalnic:', err);
    }
  });
}



  @ViewChild('myGoogleMap', { static: true }) map!: GoogleMap;

    mapOptions: google.maps.MapOptions = {
    center: { lat: 46.04585 , lng: 14.50303 },
    zoom: 14,
    mapTypeControlOptions: {
    mapTypeIds: ["roadmap"],
    },
  };

}