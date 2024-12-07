import { Component } from '@angular/core';
import { UserData } from '../model/user-data';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userData: UserData = {uid : '',name: '', phoneNumber: '', email: '', address: '', surname: ''};

  constructor(
    private auth: AuthService,
    private userService: UserDataService,
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

  }
  isLoggedIn():boolean
  {
    return this.auth.isLoggedIn()
  }
 
}
