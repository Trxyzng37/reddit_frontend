import { Injectable } from '@angular/core';
import { GetService } from 'src/app/shared/services/get/get.service';
import { GetPostResponse } from '../pojo/get-post-response';
import { BehaviorSubject, Observable } from 'rxjs';
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

  private allowedPostEndpoint: string = "/get-allowed-post-in-community";
  private deletedPostEndpoint: string = "/get-deleted-post-in-community";
  private edittedPostEndpoint: string = "/get-editted-post-ids-in-community";


  public getHomePosts(endpoint: string, uid: number, sort_option: string): Observable<GetPostResponse[]> {
    const fullUrl = endpoint + "?" + "uid=" + uid + "&" + "sort=" + sort_option;  
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getPopularPostIdsByUid(endpoint: string, uid: number, sort_option: string): Observable<number[]> {
    const fullUrl = endpoint + "?" + "sort=" + sort_option + "&" + "uid=" + uid;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getPopularPostsByUid(endpoint: string, uid: number, sort_option: string): Observable<GetPostResponse[]> {
    const fullUrl = endpoint + "?" + "sort=" + sort_option + "&" + "uid=" + uid; 
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getPostInCommunity(endpoint: string, community_id: number, sort_option: string): Observable<GetPostResponse[]> {
    const fullUrl = endpoint + "?" + "cid=" + community_id + "&" + "sort=" + sort_option; 
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getPostInCommunityNotAllow(endpoint: string, community_id: number): Observable<number[]> {
    const fullUrl = endpoint + "?" + "cid=" + community_id; 
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getAllowedPostIdsInCommunity(community_id: number): Observable<number[]> {
    const fullUrl = this.allowedPostEndpoint + "?" + "cid=" + community_id; 
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getDeletedPostIdsInCommunity(community_id: number): Observable<number[]> {
    const fullUrl = this.deletedPostEndpoint + "?" + "cid=" + community_id; 
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getEdittedPostIdsInCommunity(community_id: number): Observable<number[]> {
    const fullUrl = this.edittedPostEndpoint + "?" + "cid=" + community_id; 
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getPostForSearch(endpoint: string, search_text: string, sort_option: string): Observable<number[]> {
    const fullUrl = endpoint + "?" + "text=" + search_text + "&" + "sort=" + sort_option; 
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getPostByUser(endpoint: string, uid: number, sort_option: string): Observable<number[]> {
    const fullUrl = endpoint + "?" + "uid=" + uid + "&" + "sort=" + sort_option; 
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getPostsByUidAndNotAllowAndNotDeleted(endpoint: string, uid: number): Observable<number[]> {
    const fullUrl = endpoint + "?" + "uid=" + uid; 
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }
}
