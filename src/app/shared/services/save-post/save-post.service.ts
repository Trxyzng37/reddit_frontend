import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../pojo/default-response';
import { GetService } from '../get/get.service';
import { PostService } from '../post/post.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SavedPostRequest } from './pojo/saved-post-request';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { SavedPostResponse } from './pojo/saved-post-response';
import { CheckRefreshTokenService } from '../check-refresh-token/check-refresh-token.service';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { StorageService } from '../../storage/storage.service';
import { ShareDataService } from 'src/app/shared/services/share_data/share-data.service';


@Injectable({
  providedIn: 'root'
})
export class SavePostService {

  constructor(
    private getService: GetService,
    private postService: PostService,
    private storageService: StorageService,
    private checkRefreshToken: CheckRefreshTokenService,
    private shareDataService: ShareDataService
  ) { }

  private savedEndpoint: string = "/save-post";
  private getSavedEndpoint: string = "/get-save-post";
  public getSavePostStatusEndpoint: string = "/get-save-post-status";

  public savePostByUid(uid: number, post_id: number, saved: number): Observable<DefaultResponse> {
    this.checkRefreshToken.runCheckRefreshToken();
    const data = new SavedPostRequest(uid, post_id, saved);
    const body = JSON.stringify(data);
    let header: HttpHeaders = new HttpHeaders();
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post(this.savedEndpoint, header, body, true);
  }

  public getSavedPostsByUid(uid: number): Observable<number[]> {
    const parameter: string ="uid=" + uid; 
    const endpointWithParameter: string = this.getSavedEndpoint + "?" + parameter;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(endpointWithParameter, header, true);
  }

  public getSavedPostStatusByUid(uid: number, post_id: number): Observable<SavedPostResponse> {
    const parameter1: string ="uid=" + uid; 
    const parameter2: string ="pid=" + post_id; 
    const endpointWithParameter: string = this.getSavePostStatusEndpoint + "?" + parameter1 + "&" + parameter2;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(endpointWithParameter, header, true);
  }

  public sendSavePostToServer(post: DetailPost, save: number) {
    const uid: number = this.storageService.getItem("uid") == "" ? 0 :  Number.parseInt(this.storageService.getItem("uid"));
    this.savePostByUid(uid, post.post_id, save).subscribe({
      next: (response: DefaultResponse) => {
        post.save = save;
        // this.storageService.setSaveStatusOfPostInStorage(post.post_id, save);
        this.shareDataService.setSaveStatusOfDetailPosts(post.post_id, save);
      },
      error: (e: HttpErrorResponse) => {
        console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
      }
    })
  }
}
