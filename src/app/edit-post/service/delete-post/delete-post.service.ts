import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostService } from 'src/app/shared/services/post/post.service';
import { DeletePostResponse } from '../../pojo/delete-post-response';
import { Observable } from 'rxjs';
import { DeletePostRequest } from '../../pojo/delete-post-request';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { CheckRefreshTokenService } from 'src/app/shared/services/check-refresh-token/check-refresh-token.service';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';

@Injectable({
  providedIn: 'root'
})
export class DeletePostService {

  constructor(
    private postService: PostService,
    private storageService: StorageService,
    private checkRefreshToken: CheckRefreshTokenService,
    private shareDataService: ShareDataService
  ) { }

  public deleteEndpoint: string = "/delete-post";

  deletePost(post_id: number, uid: number, deleted_by: number): Observable<DeletePostResponse> {
    this.checkRefreshToken.runCheckRefreshToken();
    const request = new DeletePostRequest(post_id, uid, deleted_by);
    const body: string = JSON.stringify(request);
    let header: HttpHeaders = new HttpHeaders();
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post(this.deleteEndpoint, header, body, true);
  }

  sendDeleteToServer(post: DetailPost, deleted_by: number, deleteEvent: any|null) {
    const uid: number = this.storageService.getItem("uid") == "" ? 0 :  Number.parseInt(this.storageService.getItem("uid"));
    this.deletePost(post.post_id, uid, deleted_by).subscribe({
      next: (response: DeletePostResponse) => {
        post.deleted = 1;
        if(deleteEvent != null)
          deleteEvent.emit(post.post_id);
        this.shareDataService.setDeleteOfDetailPosts(post.post_id, 1);
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }
}
