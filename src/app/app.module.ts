import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { PreteklaNarocilaComponent } from './pretekla-narocila/pretekla-narocila.component';
import { KosaricaComponent } from './kosarica/kosarica.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastrModule } from 'ngx-toastr';
import { RatingDisplayComponent } from './rating-display/rating-display.component';
import { RatingCreateComponent } from './rating-create/rating-create.component';
import { OpinionsComponent } from './opinions/opinions.component';
import { GuestCartComponent } from './guest-cart/guest-cart.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


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
    PreteklaNarocilaComponent,
    KosaricaComponent,
    RatingDisplayComponent,
    RatingCreateComponent,
    OpinionsComponent,
    GuestCartComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp({"projectId":"rpo-spletna-trgovina","appId":"1:676356888271:web:01d6a08b2fa5eda03bc9ba","storageBucket":"rpo-spletna-trgovina.firebasestorage.app","apiKey":"your_firebase_API_key","authDomain":"rpo-spletna-trgovina.firebaseapp.com","messagingSenderId":"676356888271","measurementId":"G-XST2720TW8"}),
    AngularFireAuthModule,
    GoogleMapsModule,
    NgxPaginationModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'increasing',
    })

  ],
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"rpo-spletna-trgovina","appId":"1:676356888271:web:01d6a08b2fa5eda03bc9ba","storageBucket":"rpo-spletna-trgovina.firebasestorage.app","apiKey":"AIzaSyCAPwqWkHNqpPU6_gm5cGOADPCyhn9o0Wk","authDomain":"rpo-spletna-trgovina.firebaseapp.com","messagingSenderId":"676356888271","measurementId":"G-XST2720TW8"})),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
