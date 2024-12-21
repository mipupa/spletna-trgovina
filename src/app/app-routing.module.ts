import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { KontaktComponent } from './kontakt/kontakt.component';
import { TrgovinaComponent } from './trgovina/trgovina.component';
import { AboutComponent } from './about/about.component';
import { PoslovalniceComponent } from './poslovalnice/poslovalnice.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { KosaricaComponent } from './kosarica/kosarica.component';

const routes: Routes = [
  {path: "", redirectTo: "/home", pathMatch: "full"},
  {path: "home", component: HomeComponent},
  {path: "trgovina", component:TrgovinaComponent},
  {path:"poslovalnice", component:PoslovalniceComponent},
  {path:"about", component:AboutComponent},
  {path: "kontakt", component: KontaktComponent},
  {path: 'login', component: LoginComponent }, 
  {path : 'register', component: RegisterComponent},
  {path : 'forgot-password', component: ForgotPasswordComponent},
  {path : 'profile', component: CustomerProfileComponent},
  {path: 'product-details/:CategoryID/:ProductID', component: ProductDetailsComponent},
  {path: 'cart', component: KosaricaComponent},

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration:'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
