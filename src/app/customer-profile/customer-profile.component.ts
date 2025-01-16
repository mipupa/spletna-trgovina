import { Component } from '@angular/core';
import { UserData } from '../model/user-data';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent {

  userData: UserData = {uid : '',name: '', phoneNumber: '', email: '', address: '', surname: '', postalCode : '', country : '', city: ''};
  constructor(
    private auth: AuthService,
    private userService: UserDataService,
    private translate: TranslateService
  )
   {
    if(this.isLoggedIn()){
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
    }

  isLoggedIn():boolean
  {
    return this.auth.isLoggedIn()
  }
// ngOnInit(): void {
//   this.userService.getUserData(this.auth.authToken).subscribe((userData) => {
//     if (this.auth.authToken && userData.exists) {
//       this.userData = userData.data() as UserData; 
//       console.log(this.userData);
//       console.log(this.auth.authToken);
//       console.log(this.userData.name);
//       console.log("Observable subscription deluje!");
//     } else {
//       console.log('User data not found');
//     }
//   });
// }

  saveProfile() {
    this.userService.updateUserProfile(this.userData).subscribe(() => {
      alert('Profile updated successfully!');
    });
  }
}
