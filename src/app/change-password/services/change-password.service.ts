import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostService } from 'src/app/shared/services/post/post.service';
import { ChangePasswordResponse } from '../pojo/change-password-response';
import { Observable } from 'rxjs';
import { ChangePasswordRequest } from '../pojo/change-password-request';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor (
    private postService: PostService
  ) { }

  private endpoint: string = "/change-password"

  public changePassword(newPassword: string): Observable<ChangePasswordResponse> {
    const email: string = sessionStorage.getItem("forgot-password-email") as string || "";
    const changePasswordRequest: ChangePasswordRequest = new ChangePasswordRequest(email, newPassword);
    const requestBody = JSON.stringify(changePasswordRequest);
    const header: HttpHeaders = new HttpHeaders();
    return this.postService.post(this.endpoint, header, requestBody, false);
  }
}
