// interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {
    console.log("dela")
   }

  // This method intercepts every HTTP request and adds a custom header
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and add the header
    const modifiedReq = req.clone({
      headers: req.headers.set('X-Custom-Header', 'some-value')
    });
    // Return the modified request and log the response
    return next.handle(modifiedReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('Response: ', event);
        }
      })
    );
  }
}
