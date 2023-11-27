import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsernamePasswordService {

    private apiUrl: string = 'http://localhost:8080/signin/username-password'; 

    constructor(private http: HttpClient) { }
  
    login(username: string, password: string): Observable<HttpResponse<string>> {
      const body = { username, password };
      return this.http.post(this.apiUrl, body, { observe: 'response', responseType: 'text' });
    }
}

