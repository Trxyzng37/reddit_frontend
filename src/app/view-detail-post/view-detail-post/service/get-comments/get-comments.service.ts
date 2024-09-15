import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetService } from 'src/app/shared/services/get/get.service';
import { HttpHeaders } from '@angular/common/http';
import { CommentInfo } from '../../pojo/comment';

@Injectable({
  providedIn: 'root'
})
export class GetCommentsService {

  constructor(
    private getService: GetService
  ) { }
  private endpoint: string = "/get-comments";
  private getCommentsByUserEndPoint: string = "/get-comments-by-uid";
  private countCommentsEndpoint: string = "/count-comments";

  getComments(post_id: number): Observable<CommentInfo[]> {
    const fullUrl: string = this.endpoint + "?id=" + post_id;
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  getCommentsByUser(uid: number, sort: string): Observable<CommentInfo[]> {
    const fullUrl: string = this.getCommentsByUserEndPoint + "?uid=" + uid + "&" + "sort=" + sort;
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }

  countComments(post_id: number): Observable<number> {
    const fullUrl: string = this.countCommentsEndpoint + "?pid=" + post_id;
    let header: HttpHeaders = new HttpHeaders();
    return this.getService.get(fullUrl, header, true);
  }
}
