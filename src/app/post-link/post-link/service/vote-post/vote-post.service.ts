import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/shared/services/post/post.service';
import { VotePostRequest } from './pojo/vote-post-request';
import { VotePostResponse } from './pojo/vote-post-response';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VotePostService {

  constructor(
    private postService: PostService
  ) { }

  private endpoint: string = "/vote-post";

  votePost(post_id: number, vote:number, username: string, type: string): Observable<VotePostResponse> {
    let header: HttpHeaders = new HttpHeaders();
    const votePostRequest: VotePostRequest = new VotePostRequest(post_id, vote, username, type);
    const body: string = JSON.stringify(votePostRequest);
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post<VotePostResponse>(this.endpoint, header, body, false);
  }
}
