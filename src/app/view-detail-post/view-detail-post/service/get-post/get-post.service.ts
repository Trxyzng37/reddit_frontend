import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetailPost } from 'src/app/post-link-list/pojo/detail-post';
import { GetPostResponse } from 'src/app/post-link-list/pojo/get-post-response';
import { GetService } from 'src/app/shared/services/get/get.service';

@Injectable({
  providedIn: 'root'
})
export class GetPostService {

  constructor(
    private getService: GetService
  ) {}

  private endpoint: string = "/get-post";
  private detailPostEndpoint:string = "/get-detail-post";

  public getPostByPostId(post_id: number): Observable<GetPostResponse> {
    const fullUrl = this.endpoint + "?pid=" + post_id;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getDetailPostByUidAndPostId(uid: number, post_id: number): Observable<DetailPost> {
    const fullUrl = this.detailPostEndpoint + "?uid=" + uid + "&" + "pid=" + post_id;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  public getDetailPostByUidAndPostIds(uid: number, post_id: number[]): Observable<DetailPost[]> {
    const result: string = post_id.join(',');
    console.log(result)
    const fullUrl = "/get-detail-post-by-post-id" + "?uid=" + uid + "&" + "pid=" + result;
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }
}
