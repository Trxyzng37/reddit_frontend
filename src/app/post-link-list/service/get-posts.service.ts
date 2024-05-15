import { Injectable } from '@angular/core';
import { GetService } from 'src/app/shared/services/get/get.service';
import { GetPostResponse } from '../pojo/get-post-response';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { PostService } from 'src/app/shared/services/post/post.service';

@Injectable({
  providedIn: 'root'
})
export class GetPostsService {

  constructor(
    private postService: PostService,
    private getService: GetService
  ) {}


  public getHomePosts(endpoint: string, uid: number, sort_option: string): Observable<GetPostResponse[]> {
    const fullUrl = endpoint + "?" + "uid=" + uid + "&" + "sort=" + sort_option;  
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, false);
  }

  public getPopularPosts(endpoint: string, uid: number, sort_option: string): Observable<GetPostResponse[]> {
    const fullUrl = endpoint + "?" + "sort=" + sort_option + "&" + "uid=" + uid;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, false);
  }

  public getPopularPostsByUid(endpoint: string, uid: number, sort_option: string): Observable<GetPostResponse[]> {
    const fullUrl = endpoint + "?" + "sort=" + sort_option + "&" + "uid=" + uid; 
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, false);
  }

  public getPostInCommunity(endpoint: string, community_id: number, sort_option: string): Observable<GetPostResponse[]> {
    const fullUrl = endpoint + "?" + "cid=" + community_id + "&" + "sort=" + sort_option; 
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, false);
  }
}
