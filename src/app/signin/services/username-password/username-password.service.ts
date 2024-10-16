import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostService } from '../../../shared/services/post/post.service';
import { UsernamePasswordSignInRequest } from '../../pojo/username-password-signin-request';
import { UsernamePasswordSignInResponse } from '../../pojo/username-password-signin-response';
@Injectable({
  providedIn: 'root'
})
export class UsernamePasswordService {
    constructor( 
      private http: HttpClient,
      private postService: PostService
    ) {}

    private endpoint: string = "/signin/username-password";
  
    public signinByUsernamePassword(username: string, password: string): Observable<UsernamePasswordSignInResponse> {
      const user: UsernamePasswordSignInRequest = new UsernamePasswordSignInRequest(username, password);
      const body: string = JSON.stringify(user);
      let header: HttpHeaders = new HttpHeaders();
      header = header.append("Accept", 'application/json');
      header = header.append('Content-Type', 'application/json');
      return this.postService.post(this.endpoint, header, body, true);
    }
}

