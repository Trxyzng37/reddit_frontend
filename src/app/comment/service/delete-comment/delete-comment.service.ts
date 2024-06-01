import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/shared/services/post/post.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { DeleteCommentRequest } from '../../pojo/delete-comment-request';
import { HttpHeaders } from '@angular/common/http';
import { DeleteCommentResponse } from '../../pojo/delete-comment-response';

@Injectable({
  providedIn: 'root'
})
export class DeleteCommentService {

  constructor(
    private postService: PostService,
    private storageService: StorageService
  ) { }

  private endpoint: string = "/delete-comment";

  deleteComment(post_id: number, _id: number): Observable<DeleteCommentResponse> {
    const request = new DeleteCommentRequest(post_id, _id);
    const body: string = JSON.stringify(request);
    let header: HttpHeaders = new HttpHeaders();
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post<DeleteCommentResponse>(this.endpoint, header, body, false);
  }
}
