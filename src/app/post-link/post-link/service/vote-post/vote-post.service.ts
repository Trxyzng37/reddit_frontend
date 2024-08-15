import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/shared/services/post/post.service';
import { VotePostRequest } from './pojo/vote-post-request';
import { VotePostResponse } from './pojo/vote-post-response';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { VoteInfo } from 'src/app/shared/pojo/vote-info';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { StorageService } from 'src/app/shared/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class VotePostService {

  constructor(
    private postService: PostService,
    private checkRefreshToken: CheckRefreshTokenService,
    private storageService: StorageService
  ) { }

  private endpoint: string = "/vote-post";

  votePost(post_id: number, vote:number, uid: number, type: string): Observable<VotePostResponse> {
    this.checkRefreshToken.runCheckRefreshToken();
    let header: HttpHeaders = new HttpHeaders();
    const votePostRequest: VotePostRequest = new VotePostRequest(post_id, vote, uid, type);
    const body: string = JSON.stringify(votePostRequest);
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post(this.endpoint, header, body, true);
  }

  prepareVote(type: string, post: DetailPost): VoteInfo {
    let prevVote: number = post.vote;
    let prevVoteType: string|null = post.voteType;
    let curVote: number = post.vote;
    let curVoteType: string|null = post.voteType;
    if (curVoteType === 'none' && type === 'upvote') {
      curVote += 1;
      curVoteType = 'upvote';
    }
    else if (curVoteType === 'none' && type === 'downvote') {
      curVote -= 1;
      curVoteType = 'downvote';
    }
    else if (curVoteType === 'upvote' && type === 'upvote') {
      curVote -= 1;
      curVoteType = 'none';
    }
    else if (curVoteType === 'upvote' && type === 'downvote') {
      curVote -= 2;
      curVoteType = 'downvote';
    }
    else if (curVoteType === 'downvote' && type === 'upvote') {
      curVote += 2;
      curVoteType = 'upvote';
    }
    else if (curVoteType === 'downvote' && type === 'downvote') {
      curVote += 1;
      curVoteType = 'none';
    }
    return new VoteInfo(curVote, prevVote, curVoteType, prevVoteType);
  }

  sendVotePostToServer(post: DetailPost, voteInfo: VoteInfo) {
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
      this.votePost(post.post_id, voteInfo.curVote, uid, voteInfo.curVoteType!).subscribe({
        next: (response: VotePostResponse) => {
          post.vote = voteInfo.curVote;
          post.voteType = voteInfo.curVoteType;
          this.storageService.setVoteOfPostInStorage(post.post_id, voteInfo.curVote);
          this.storageService.setVoteTypeOfPostInStorage(post.post_id, voteInfo.curVoteType);
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
  }
}
