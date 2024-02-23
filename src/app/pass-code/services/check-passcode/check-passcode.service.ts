import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailExistService } from 'src/app/forgot-password/services/email-exist/check-email.service';
import { PassCodeRequest } from 'src/app/shared/pojo/passcode-request';
import { PasscodeResponse } from 'src/app/shared/pojo/passcode-response';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { PostService } from 'src/app/shared/services/post/post.service';
import { ServerUrlService } from 'src/app/shared/services/server-url/server-url.service';
import { StorageService } from 'src/app/shared/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CheckPasscodeService {
  constructor(
    private postService: PostService,
    private dateTimeService: DateTimeService,
    private storageService: StorageService
  ) {}

  private endpoint: string = "/check-passcode";

  checkPasscode(passcode: number): Observable<PasscodeResponse> {
    const email: string = this.storageService.getItem("forgot-password-email");
    if (email === "")
      alert("Empty email for check passcode")
    const sendAt: Date = this.dateTimeService.getCurrentDateTime();
    const passcodeRequest: PassCodeRequest = new PassCodeRequest(email, passcode, sendAt);
    const requestBody: string = JSON.stringify(passcodeRequest);
    const header: HttpHeaders = new HttpHeaders();
    return this.postService.post(this.endpoint, header, requestBody, false);
  }
}
