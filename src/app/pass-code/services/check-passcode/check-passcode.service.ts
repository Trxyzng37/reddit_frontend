import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckEmailService } from 'src/app/forgot-password/services/check-email/check-email.service';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { ServerUrlService } from 'src/app/shared/services/server-url/server-url.service';

@Injectable({
  providedIn: 'root'
})
export class CheckPasscodeService {
  private email: string = "";
  private endpoint: string = "/check-passcode";
  private fullUrl: string = this.serverUrlService.createFullUrl(this.endpoint);
  constructor(
    private serverUrlService: ServerUrlService, 
    private checkEmailService: CheckEmailService,
    private http: HttpClient,
    private dateTimeService: DateTimeService
  ) {}

  checkPasscode(passcode: number): Observable<Object> {
    this.email = this.checkEmailService.getEmail();
    const sendTime: string = this.dateTimeService.getCurrentDateTime();
    const body = `{"email":"${this.email}",
                    "passcode":"${passcode}",
                    "sendAt":"${sendTime}"}`;
    return this.http.post(this.fullUrl, body, { observe: 'body', responseType: "json"});
  }
}
