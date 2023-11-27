import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthenticationService {

  private apiUrl: string = 'http://localhost:8080/signin/check-google-jwt-token'; 

  constructor(private http: HttpClient) { }

  getGoogleJwtToken(): Observable<string> {
    return this.http.get(this.apiUrl, { observe: 'body', responseType: "text"});
  }
}
