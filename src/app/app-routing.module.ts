import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { KontaktComponent } from './kontakt/kontakt.component';
import { TrgovinaComponent } from './trgovina/trgovina.component';
import { AboutComponent } from './about/about.component';
import { PoslovalniceComponent } from './poslovalnice/poslovalnice.component';

const routes: Routes = [
  {path: "", redirectTo: "/home", pathMatch: "full"},
  {path: "home", component: HomeComponent},
  {path: "trgovina", component:TrgovinaComponent},
  {path:"poslovalnice", component:PoslovalniceComponent},
  {path:"about", component:AboutComponent},
  {path: "kontakt", component: KontaktComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration:'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
