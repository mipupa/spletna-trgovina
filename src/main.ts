import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { AngularFirestore } from '@angular/fire/compat/firestore';


platformBrowserDynamic().bootstrapModule(AppModule)

/* Dodajanje poslovalnic
.then((moduleRef) => {
  const firestore = moduleRef.injector.get(AngularFirestore);
  const Branch = [
    { address: "Zoisova cesta 8, 1000 Ljubljana",
      contact: "040 300 300",
      img_url: "assets/img/poslovalnica_1.jpg",
      loc_lat: 46.04585,
      loc_lng: 14.50303,
      manager: "Janez Novak",
      name: "Enota Ljubljana",
      working_hours: "8:30 - 19:00",
    },
    { address: "Tržaška cesta 14, 2000 Maribor",
      contact: "040 204 304",
      img_url: "assets/img/poslovalnica_2.jpg",
      loc_lat: 46.54031,
      loc_lng: 15.64641,
      manager: "Maja Horvat",
      name: 'Enota Maribor',
      working_hours: "9:00 - 20:00",
    },
    { address: "Ljubljanska cesta 47, 8000 Novo mesto",
      contact: "040 561 231",
      img_url: "assets/img/poslovalnica_3.jpg",
      loc_lat: 45.82152,
      loc_lng: 15.15468,
      manager: "Niko Dolenjc",
      name: 'Enota Novo mesto',
      working_hours: "9:00 - 19:00",
    },

    
  ];
    Branch.forEach((Poslovalnica) => {
    firestore.collection('Branch').add(Poslovalnica)
    
  }); 
})

*/

  .catch(err => console.error(err));

  
