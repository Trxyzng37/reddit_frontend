import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostService } from 'src/app/shared/services/post/post.service';
import { DeletePostResponse } from '../../pojo/delete-post-response';
import { Observable } from 'rxjs';
import { DeletePostRequest } from '../../pojo/delete-post-request';
import { StorageService } from 'src/app/shared/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DeletePostService {

  constructor(
    private postService: PostService,
    private storageService: StorageService
  ) { }

  deletePost(endpoint: string, post_id: number): Observable<DeletePostResponse> {
    const username = this.storageService.getItem("username");
    const request = new DeletePostRequest(post_id, username);
    const body: string = JSON.stringify(request);
    let header: HttpHeaders = new HttpHeaders();
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    return this.postService.post<DeletePostResponse>(endpoint, header, body, false);
  }
}
