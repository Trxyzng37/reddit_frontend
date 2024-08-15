import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from 'src/app/shared/pojo/default-response';
import { PostService } from 'src/app/shared/services/post/post.service';
import { AllowPostRequest } from './pojo/allow-post-request';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { StorageService } from 'src/app/shared/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AllowPostService {

  constructor(
    private postService: PostService,
    private checkRefreshToken: CheckRefreshTokenService,
    private storageService: StorageService
  ) { }

  private endpoint: string = "/set-allow-post";

  setAllowPost(post_id: number, allow: number): Observable<DefaultResponse> {
    this.checkRefreshToken.runCheckRefreshToken();
    let header: HttpHeaders = new HttpHeaders();
    const votePostRequest: AllowPostRequest = new AllowPostRequest(post_id, allow);
    const body: string = JSON.stringify(votePostRequest);
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post(this.endpoint, header, body, true);
  }

  sendAllowToServer(post: DetailPost, allow: number) {
    this.setAllowPost(post.post_id, allow).subscribe({
      next: (response: DefaultResponse) => {
        post.allow = allow;
        this.storageService.setAllowOfPostInStorage(post.post_id, allow);
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }
}
