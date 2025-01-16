import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

interface Opinion {
  ProductID: number;
  opinion: string;
  uid: string;
}

interface User {
  name: string;
}

@Component({
  selector: 'app-opinions',
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.css']
})
export class OpinionsComponent implements OnInit {
  @Input() productId!: number; // ID trenutnega produkta
  opinionForm!: FormGroup;
  isLoggedIn: boolean = false;
  hasOpinion: boolean = false;
  uid!: string;
  opinions: Array<Opinion & { userName: string }> = [];


  
  constructor(private fb: FormBuilder, private firestore: AngularFirestore, private toastr:ToastrService, private translate: TranslateService) {
    this.translate.setDefaultLang('sl');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|de/) ? browserLang : 'sl');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  ngOnInit(): void {
    // Inicializiraj obrazec
    this.opinionForm = this.fb.group({
      opinion: ['', [Validators.required, Validators.minLength(5)]],
    });

    const savedLang = localStorage.getItem('language');
    if(savedLang) {
      this.translate.use(savedLang);
    }

    // Preveri, če je uporabnik prijavljen
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
      this.uid = token;
      this.checkIfOpinionExists();
     
    }
    // Naloži vsa mnenja za produkt
    this.loadOpinions();   

  }

  loadOpinions(): void {
    this.firestore
      .collection<Opinion>('Opinions', ref => ref.where('ProductID', '==', this.productId))
      .valueChanges()
      .pipe(
        switchMap(opinions => {
          const opinionsWithNames$ = opinions.map(opinion =>
            this.getUserNameByUid(opinion.uid).pipe(
              map(userName => ({ ...opinion, userName }))
            )
          );
          return combineLatest(opinionsWithNames$);
        })
      )
      .subscribe(opinionsWithNames => {
        this.opinions = opinionsWithNames;
      });
  }

  getUserNameByUid(uid: string): Observable<string> {
    return this.firestore
      .collection<User>('User')
      .doc(uid)
      .valueChanges()
      .pipe(
        map(userData => userData?.name || 'Neznan uporabnik'),
        catchError(err => {
          console.error('Napaka pri pridobivanju imena uporabnika:', err);
          return of('Neznan uporabnik');
        })
      );
  }

  checkIfOpinionExists(): void {
    this.firestore
      .collection('Opinions', ref =>
        ref.where('ProductID', '==', this.productId).where('uid', '==', this.uid))
      .get()
      .subscribe(snapshot => {
        if (!snapshot.empty) {
          this.hasOpinion = true;
        }
      });
  }

  submitOpinion(): void {
    if (this.opinionForm.valid && !this.hasOpinion) {
      const opinionData: Opinion = {
        ProductID: this.productId,
        opinion: this.opinionForm.value.opinion,
        uid: this.uid,
      };

      this.firestore.collection('Opinions').add(opinionData).then(() => {
        this.hasOpinion = true;
        this.opinionForm.reset();
        this.toastr.success('Mnenje uspešno shranjeno!');
      }).catch(err => {
        console.error('Napaka pri shranjevanju mnenja:', err);
      });
    }
  }

}