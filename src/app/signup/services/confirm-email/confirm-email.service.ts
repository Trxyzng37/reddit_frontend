import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IsPasscodeMatch } from 'src/app/shared/pojo/is-passcode-match';
import { PassCode } from 'src/app/shared/pojo/passcode';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { PostService } from 'src/app/shared/services/post/post.service';
import { ServerUrlService } from 'src/app/shared/services/server-url/server-url.service';
import { IsSignUp } from '../is-signup';

@Injectable({
  providedIn: 'root'
})
export class ConfirmEmailService {

  constructor (
    private serverurl: ServerUrlService, 
    private postService: PostService,
    private dateTimeService: DateTimeService,
  ) { }

  private endpoint: string = "/check-confirm-email-passcode";
  private fullUrl: string = this.serverurl.getUrl() + this.endpoint;

  public checkConfirmEmailPasscode(passcode: number): Observable<IsPasscodeMatch> {
    const email: string = localStorage.getItem("confirm_email") as string || "";
    const pascode: number = passcode;
    const sendAt: Date = this.dateTimeService.getCurrentDateTime();
    const passcodeData: PassCode = new PassCode(email, pascode, sendAt);
    const body: string = JSON.stringify(passcodeData);
    const header: HttpHeaders = new HttpHeaders();
    return this.postService.post(this.endpoint, header, body, false);
  }

  public reSendPasscode(email: string): Observable<IsSignUp> {
    const endpoint: string = "/resend-confirm-email-passcode";
    const body: string = `{"email":"${email}"}`
    const header: HttpHeaders = new HttpHeaders();
    return this.postService.post(endpoint, header, body, false);
  }
}
