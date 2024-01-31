import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/shared/services/server-url/server-url.service';

@Injectable({
  providedIn: 'root'
})
export class CheckPasscodeService {
  private emailAddress: string = "";
  private endpoint: string = "/check-pass-code";
  private fullUrl: string = this.serverUrlService.createFullUrl(this.endpoint);
  constructor(
    private serverUrlService: ServerUrlService, 
    private http: HttpClient
  ) {}

  checkPasscode(passcode: number): Observable<Object> {
    const body = `{"passcode":"${passcode}"}`;
    return this.http.post(this.fullUrl, body, { observe: 'body', responseType: "json", withCredentials: true});
  }
}
