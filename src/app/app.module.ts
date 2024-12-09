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
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    KontaktComponent,
    TrgovinaComponent,
    AboutComponent,
    PoslovalniceComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    CustomerProfileComponent,
    ProductDetailsComponent,  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp({"projectId":"rpo-spletna-trgovina","appId":"1:676356888271:web:01d6a08b2fa5eda03bc9ba","storageBucket":"rpo-spletna-trgovina.firebasestorage.app","apiKey":"AIzaSyCAPwqWkHNqpPU6_gm5cGOADPCyhn9o0Wk","authDomain":"rpo-spletna-trgovina.firebaseapp.com","messagingSenderId":"676356888271","measurementId":"G-XST2720TW8"}),
    AngularFireAuthModule,
    GoogleMapsModule,
    NgxPaginationModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"rpo-spletna-trgovina","appId":"1:676356888271:web:01d6a08b2fa5eda03bc9ba","storageBucket":"rpo-spletna-trgovina.firebasestorage.app","apiKey":"AIzaSyCAPwqWkHNqpPU6_gm5cGOADPCyhn9o0Wk","authDomain":"rpo-spletna-trgovina.firebaseapp.com","messagingSenderId":"676356888271","measurementId":"G-XST2720TW8"})),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
