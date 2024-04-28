import { Injectable } from '@angular/core';
import { PostService } from 'src/app/shared/services/post/post.service';
import { CommentRequest } from '../../pojo/create-comment-request';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CreateCommentResponse } from '../../pojo/create-comment-response';
import { StorageService } from 'src/app/shared/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CreateCommentService {

  constructor(
    private postService: PostService,
    private storageService: StorageService
  ) { }

  private endpoint: string = "/save-comment";

  createComment(post_id: number, parent_id: number, content: string, level: number): Observable<CreateCommentResponse> {
    const uid = this.storageService.getItem("uid") == null ? -1 : parseInt(this.storageService.getItem("uid"));
    const request = new CommentRequest(post_id, uid, parent_id, content, level);
    const body: string = JSON.stringify(request);
    let header: HttpHeaders = new HttpHeaders();
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post<CreateCommentResponse>(this.endpoint, header, body, false);
  }
}
