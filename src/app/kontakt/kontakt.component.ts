import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-kontakt',
  templateUrl: './kontakt.component.html',
  styleUrl: './kontakt.component.css'
})
export class KontaktComponent {

  private apiUrl = 'http://localhost:3000/kontakt'; //api endpoint 
  response: any;

  constructor(private http: HttpClient, private translate: TranslateService) { 
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

  form = {

    name: '',
    email: '',
    phone: '',
    message: ''
  }

  onSubmit(kontaktForm: NgForm) {

    if (kontaktForm.valid) {
      this.sendPostRequest();
     
    } 
  }

  sendKontaktForm(data: any): Observable<any> {

    
    return this.http.post<any>(this.apiUrl, data);
  }

  sendPostRequest(): void {

    const postData = {
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      msg: this.form.message
    };

    this.sendKontaktForm(postData).subscribe(
      (res) => {
        console.log(res);
        this.response = res;
        
      },
      (err) => {
        console.error(err);
      }
    );
  }
}