import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from './login';
import { PostService } from 'src/app/shared/services/post/post.service';
@Injectable({
  providedIn: 'root'
})
export class UsernamePasswordService {
    constructor( 
      private http: HttpClient,
      private postService: PostService
    ) {}

    private endpoint: string = "/signin/username-password";
  
    signinByUsernamePassword(username: string, password: string): Observable<Login> {
      const body =  `{"username":"${username}","password":"${password}"}`;
      const header: HttpHeaders = new HttpHeaders();
      return this.postService.post<Login>(this.endpoint, header, body, false);
    }
}

