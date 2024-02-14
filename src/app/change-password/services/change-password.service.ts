import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostService } from 'src/app/shared/services/post/post.service';
import { ChangePassword } from './change-password';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor (
    private postService: PostService
  ) { }

  private endpoint: string = "/change-password"

  public changePassword(email: string, password: string): Observable<ChangePassword> {
    const body = `{"email":"${email}","newPassword":"${password}"}`;
    const header: HttpHeaders = new HttpHeaders();
    const observable: Observable<ChangePassword> = this.postService.post<ChangePassword>(this.endpoint, header, body, false);
    return observable;
}
}
