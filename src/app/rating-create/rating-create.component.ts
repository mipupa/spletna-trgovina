import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rating-create',
  templateUrl: './rating-create.component.html',
  styleUrls: ['./rating-create.component.css']
})
export class RatingCreateComponent {
  @Input() productId!: number; // Produkt ID za Firestore
  rating: number = 0; // Izbrana ocena
  hover: number = 0; // Trenutni hover
  stars: number[] = [0, 1, 2, 3, 4]; // Število zvezdic
  hasRated: boolean = false; // Ali je uporabnik že ocenil ta izdelek
  isLoggedIn: boolean = false; //Ali je logiran, sicer je gost

  constructor(private firestore: AngularFirestore, private toastr: ToastrService, private translate: TranslateService) {
    this.translate.setDefaultLang('sl');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|de/) ? browserLang : 'sl');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    
    const savedLang = localStorage.getItem('language');
    if(savedLang) {
      this.translate.use(savedLang);
    }

    this.checkIfRated();
  }

  setRating(value: number): void {
    if (this.hasRated) {
      this.toastr.info('Ta izdelek si že ocenil.');
      return;
    }

    this.rating = value; // Nastavi izbrano oceno
    this.submitRating(); // Pošlje oceno takoj po kliku
  }

  setHover(value: number): void {
    if (!this.hasRated) {
      this.hover = value;
    }
  }

  checkIfRated(): void {
    const uid = localStorage.getItem('token');
    if (!uid) {
      //console.warn('User not logged in!');
      return;
    }

    this.firestore
      .collection('Rating', ref =>
        ref.where('ProductID', '==', this.productId).where('uid', '==', uid)
      )
      .get()
      .subscribe(querySnapshot => {
        this.hasRated = !querySnapshot.empty;
      });
  }

  submitRating(): void {
    const uid = localStorage.getItem('token');
    if (!uid) {
      this.toastr.info('Za podajanje ocen se prijavi!');
      return;
    }

    if (!this.productId) {
      this.toastr.error('Product ID is not defined!');
      return;
    }

    const documentId = `${this.productId}_${uid}`;

    this.firestore
      .collection('Rating')
      .doc(documentId)
      .set({
        ProductID: this.productId,
        rating: this.rating,
        uid: uid
      })
      .then(() => {
        this.toastr.success('Ocena zabeležena!');
        this.hasRated = true;
      })
      .catch(error => {
        console.error('Error submitting rating: ', error);
      });
  }
}