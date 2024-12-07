import { Component } from '@angular/core';
import { UserData } from '../model/user-data';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.css'
})
export class CustomerProfileComponent {

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
