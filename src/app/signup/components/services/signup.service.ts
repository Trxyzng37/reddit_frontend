import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/shared/services/server-url/server-url.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  constructor(private serverurl: ServerUrlService, private http: HttpClient){}

  private endpoint: string = "/signup";
  private fullUrl: string = this.serverurl.getUrl() + this.endpoint;

  signup(username: string, password: string, email: string): Observable<HttpResponse<string>> {
    const body =  `{"username":"${username}","password":"${password}","email":"${email}", "role":"customer"}`;
    const header: HttpHeaders = new HttpHeaders({});
    console.log(body)
    return this.http.post(this.fullUrl, body, { headers: header, observe: 'response', responseType: 'text', withCredentials: true });
  }
}
