import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KontaktComponent } from './kontakt/kontakt.component';
import { HttpClientModule } from '@angular/common/http';
import { TrgovinaComponent } from './trgovina/trgovina.component';
import { AboutComponent } from './about/about.component';
import { PoslovalniceComponent } from './poslovalnice/poslovalnice.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    KontaktComponent,
    TrgovinaComponent,
    AboutComponent,
    PoslovalniceComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"rpo-spletna-trgovina","appId":"1:676356888271:web:01d6a08b2fa5eda03bc9ba","storageBucket":"rpo-spletna-trgovina.firebasestorage.app","apiKey":"AIzaSyCAPwqWkHNqpPU6_gm5cGOADPCyhn9o0Wk","authDomain":"rpo-spletna-trgovina.firebaseapp.com","messagingSenderId":"676356888271","measurementId":"G-XST2720TW8"})),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
