import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from './login';
import { PostService } from 'src/app/shared/services/post/post.service';
import { Username } from './username';
@Injectable({
  providedIn: 'root'
})
export class UsernamePasswordService {
    constructor( 
      private http: HttpClient,
      private postService: PostService
    ) {}

    private endpoint: string = "/signin/username-password";
  
    public signinByUsernamePassword(username: string, password: string): Observable<Login> {
      const user: Username = new Username(username, password);
      const body: string = JSON.stringify(user);
      const header: HttpHeaders = new HttpHeaders();
      return this.postService.post<Login>(this.endpoint, header, body, false);
    }
}

