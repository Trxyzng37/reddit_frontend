import { Injectable } from '@angular/core';
import { ServerUrlService } from '../server-url/server-url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//Store access_token
export class AccessTokenService {
  
  private access_token: string = "";
  private endpoint: string = "/get-access-token";
  private fullUrl: string = this.serverurl.getUrl() + this.endpoint;
  
  constructor(private serverurl: ServerUrlService, private http: HttpClient) { }

  public set_access_token(access_token: string) {
    this.access_token = access_token;
  }

  public get_access_token(): string {
      return this.access_token;
  }

  public get_access_token_from_server(): Observable<string> {
    return this.http.get(this.fullUrl, { observe: 'body', responseType: "text", withCredentials: true});
  }

  public set_access_token_header(): HttpHeaders {
    let header: HttpHeaders = new HttpHeaders();
    header = header.append("Authorization", `Bearer ${this.access_token}`);
    return header;
  }
}
