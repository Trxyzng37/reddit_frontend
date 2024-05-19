import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from 'src/app/shared/pojo/default-response';
import { PostService } from 'src/app/shared/services/post/post.service';
import { AllowPostRequest } from './pojo/allow-post-request';

@Injectable({
  providedIn: 'root'
})
export class AllowPostService {

  constructor(
    private postService: PostService
  ) { }

  private endpoint: string = "/set-allow-post";

  setAllowPost(post_id: number, allow: number): Observable<DefaultResponse> {
    let header: HttpHeaders = new HttpHeaders();
    const votePostRequest: AllowPostRequest = new AllowPostRequest(post_id, allow);
    const body: string = JSON.stringify(votePostRequest);
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post<DefaultResponse>(this.endpoint, header, body, false);
  }
}
