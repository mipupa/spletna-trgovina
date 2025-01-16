import { Component, OnInit } from '@angular/core';
import { UserData } from '../model/user-data';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  userData: UserData = {
    uid: '',
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    surname: '',
    postalCode: '',
    country: '',
    city: ''
  };

  originalUserData: UserData | null = null;

  constructor(
    private auth: AuthService,
    private userService: UserDataService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    if (this.isLoggedIn()) {
      this.userService.getUserData(this.auth.authToken).subscribe((doc) => {
        if (this.auth.authToken && doc.exists) {
          this.userData = doc.data() as UserData;
          this.originalUserData = { ...this.userData }; // Shrani začetno stanje
          console.log(this.userData);
        } else {
          console.log('User data not found');
        }
      });
    }

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
    if (savedLang) {
      this.translate.use(savedLang);
    }
    this.userService.getUserData(this.auth.authToken).subscribe((userData) => {
      if (this.auth.authToken && userData.exists) {
        this.userData = userData.data() as UserData;
        this.originalUserData = { ...this.userData }; // Shrani začetno stanje
        console.log(this.userData);
      } else {
        console.log('User data not found');
      }
    });
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  saveProfile() {
    // Preverimo, ali so podatki spremenjeni
    const isChanged = this.originalUserData && Object.keys(this.userData).some(
      (key) => this.userData[key as keyof UserData] !== this.originalUserData![key as keyof UserData]
    );

    if (!isChanged) {
      this.toastr.info("Ni sprememb za shranjevanje.");
      return;
    }

    // Posodobi profil le, če so podatki spremenjeni
    this.userService.updateUserProfile(this.userData).subscribe(() => {
      this.toastr.success("Profil uspešno posodobljen.");
      this.originalUserData = { ...this.userData }; // Posodobi originalno stanje
    });
  }
}

