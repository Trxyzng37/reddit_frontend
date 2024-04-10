import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRequest } from 'src/app/create-post/pojo/post';
import { PostService } from 'src/app/shared/services/post/post.service';

@Injectable({
  providedIn: 'root'
})
export class SendPostService {

  constructor(
    private postService: PostService

  ) {}

  private endpoint: string = "/create-post";

  createPost(type: string, community: string, title: string, content: string): Observable<boolean> {
    const request = new PostRequest(type, community, title, content);
    const body: string = JSON.stringify(request);
    const header: HttpHeaders = new HttpHeaders();
    return this.postService.post(this.endpoint, header, body, false);
  }
}
