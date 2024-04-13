import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRequest } from 'src/app/create-post/pojo/create-post-request';
import { CreatePostResponse } from 'src/app/create-post/pojo/create-post-response';
import { PostService } from 'src/app/shared/services/post/post.service';

@Injectable({
  providedIn: 'root'
})
export class SendPostService {

  constructor(
    private postService: PostService

  ) {}

  private endpoint: string = "/create-post";

  createPost(type: string, username: string, community: string, title: string, content: string, created_at: Date): Observable<CreatePostResponse> {
    const request = new PostRequest(type, username, community, title, content, created_at);
    const body: string = JSON.stringify(request);
    // console.log(request)
    let header: HttpHeaders = new HttpHeaders();
    header = header.append("Accept", 'application/json');
    header = header.append('Content-Type', 'application/json');
    // header = header.append('Access-Control-Allow-Origin', '*');
    return this.postService.post<CreatePostResponse>(this.endpoint, header, body, false);
  }
}
