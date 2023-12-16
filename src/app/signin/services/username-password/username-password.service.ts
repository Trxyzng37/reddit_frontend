import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/shared/services/server-url.service';
@Injectable({
  providedIn: 'root'
})
export class UsernamePasswordService {
    constructor(private serverurl: ServerUrlService, private http: HttpClient){}

    private endpoint: string = "/signin/username-password";
    private fullUrl: string = this.serverurl.getUrl() + this.endpoint;
  
    login(username: string, password: string): Observable<HttpResponse<string>> {
      const body =  `{"user":"${username}","password":"${password}"}`;
      const header: HttpHeaders = new HttpHeaders({
        // 'withCredentials': 'include'
      });
      console.log(body)
      return this.http.post(this.fullUrl, body, { headers: header, observe: 'response', responseType: 'text', withCredentials: true });
    }
}

