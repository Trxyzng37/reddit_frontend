import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from 'src/app/shared/pojo/default-response';
import { PostService } from 'src/app/shared/services/post/post.service';
import { EditUserProfileRequest } from '../pojo/edit-user-info-request';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EditUserInfoService {

  constructor(
    private postService: PostService
  ) { }

  private editEndpoint: string = "/edit-user-info";

  updateUserInfoByUid(uid: number, description: string, avatar: string): Observable<DefaultResponse> {
    const body = JSON.stringify(new EditUserProfileRequest(uid, description, avatar));
    let header: HttpHeaders = new HttpHeaders();
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post(this.editEndpoint, header, body, false);
  }
}
