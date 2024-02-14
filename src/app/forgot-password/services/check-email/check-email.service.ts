import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/shared/services/server-url/server-url.service';

@Injectable({
  providedIn: 'root'
})
export class CheckEmailService {
  private email: string = "";
  private endpoint: string = "/check-email";
  private fullUrl: string = this.serverUrlService.createFullUrl(this.endpoint);
  
  constructor(
    private serverUrlService: ServerUrlService, 
    private http: HttpClient
  ) {}

  checkEmail(email: string): Observable<Object> {
    const urlWithParam: string = this.fullUrl + "?email=" + email; 
    return this.http.get(urlWithParam, { observe: 'body', responseType: "json"});
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }
}
