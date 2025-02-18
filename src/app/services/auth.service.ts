import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap, of, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
 import { Subject } from 'rxjs';
 import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authToken: string = "";
  public isLogged : boolean = false;
  private authState = new Subject<boolean>();

  constructor(private toastr: ToastrService, private http: HttpClient,private firestore : AngularFirestore, private fireauth: AngularFireAuth, private router: Router) {
    // Subscribe to changes in authentication state to update the currentUserUid
    this.fireauth.authState.subscribe((user) => {
      if (user) {
        this.authToken = user.uid;
      } else {
        this.authToken = "";
      }
    });
  }
  // login method
  login(email : string, password : string) {
    this.fireauth.signInWithEmailAndPassword(email,password).then( res => {
      const userUid = res.user?.uid;
      this.authToken = userUid ?? '';
      localStorage.setItem('token', this.authToken); // Store the user's UID
      console.log('AuthToken set in localStorage:', this.authToken);
        if(res.user?.emailVerified == true) {
          this.isLogged = true;
          console.log("Is logged" + this.isLogged)
          console.log("User token:", this.authToken)
          this.toastr.success("Prijava uspela.")
          this.router.navigate(['/home']);
        } else {
          this.isLogged = true;
          console.log("User token:", this.getData(this.authToken));
          //this.router.navigate(['/varify-email']);
          this.router.navigate(['/home']);

        }

    }, err => {
        alert(err.message);
        this.router.navigate(['/login']);
    })
  }

  // register method
  register(email : string, password : string, name:string, phoneNumber: string, address: string, surname: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
      const userUid = res.user?.uid;
      const userData = {
        uid : userUid,
        email: email,
        name: name,
        phoneNumber: phoneNumber,
        address: address,
        surname: surname};
      this.firestore.collection('User').doc(userUid).set(userData)
      this.toastr.success("Registracija uspela.")
      //alert('Registration Successful');
      this.sendEmailForVarification(res.user);
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    })
  }

  // sign out
  logout() {
    this.fireauth.signOut().then(() => {
      this.authToken = ""; // Update authToken to empty string
      localStorage.removeItem('token');
      this.router.navigate(['/trgovina']);
    }, err => {
      alert(err.message);
    })
    console.log('AuthToken cleared from localStorage :', this.authToken);
  }

  // forgot password
  forgotPassword(email : string) {
      this.fireauth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['/varify-email']);
      }, err => {
        this.toastr.success("Ups...Nekaj je šlo narobe.")
      })
  }

  // email varification
  sendEmailForVarification(user : any) {
    console.log(user);
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/varify-email']);
    }, (err : any) => {
      alert('Ups...E-mail sporočila ni bilo mogoče poslati na vaš e-mail.')
    })
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {

      this.router.navigate(['/home']);
      localStorage.setItem('token',JSON.stringify(res.user?.uid));

    }, err => {

      alert(err.message);
    })
  }

  isLoggedIn():boolean{
    return this.authToken != "";
  }
  
  getData(uid: string): Observable<any> {
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          // User is authenticated, query Firestore using the UID
          return this.firestore.collection('User').doc(uid).get();
        } else {
          // User is not authenticated, return an empty object or handle accordingly
          return of();
        }
      })
    );
  }
  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getCurrentUser() {
    return this.fireauth.currentUser; // Pridobi trenutnega uporabnika
  }

}