import { Component, OnInit } from '@angular/core';
import { UserData } from '../model/user-data';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  userData: UserData = {uid : '',name: '', phoneNumber: '', email: '', address: '', surname: '', postalCode : '', country : '', city: ''};

  isLoggedIn: boolean = false;

  constructor(private auth: AuthService,private userService: UserDataService, private translate: TranslateService)
   {
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
     
       this.isLoggedIn = this.auth.isLoggedIn();

    if(this.isLoggedIn){
    this.userService.getUserData(this.auth.authToken).subscribe((doc) => {
      if (this.auth.authToken && doc.exists) {
        this.userData = doc.data() as UserData; 
        console.log(this.userData);
        console.log(this.auth.authToken);
        console.log(this.userData.name);
        console.log("Observable subscription deluje!");
      } else {
        console.log('User data not found');
      }
    })}
    ;
    
  }
 
}
