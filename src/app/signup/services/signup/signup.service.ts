import {HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUrlService } from 'src/app/shared/services/server-url/server-url.service';
import { SignupData } from './signup-data';
import { IsSignUp } from '../is-signup';
import { PostService } from 'src/app/shared/services/post/post.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  constructor (
    private serverurl: ServerUrlService, 
    private postService: PostService
    ) {}

  private endpoint: string = "/signup";
  private fullUrl: string = this.serverurl.getUrl() + this.endpoint;

  public UsernamePasswordSignUp(username: string, password: string, email: string): Observable<IsSignUp> {
    const signUpData: SignupData = new SignupData(username, password, email);
    const body: string = JSON.stringify(signUpData);
    const header: HttpHeaders = new HttpHeaders();
    return this.postService.post(this.endpoint, header, body, false);
  }
}
