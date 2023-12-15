import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from 'src/app/shared/constants';
import { ServerUrlService } from 'src/app/shared/services/server-url.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthenticationService {

  private endpoint: string = "/signin/check-google-jwt-token"
  private fullUrl: string =this.serverurlService.getUrl() + this.endpoint;

  constructor(private http: HttpClient, private serverurlService: ServerUrlService) { }

  getGoogleJwtToken(): Observable<string> {
    return this.http.get(this.fullUrl, { observe: 'body', responseType: "text"});
  }
}
