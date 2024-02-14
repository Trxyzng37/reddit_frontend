import { Injectable } from '@angular/core';
import { ServerUrlService } from '../server-url/server-url.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private serverurl: ServerUrlService, 
    private http: HttpClient
  ) {}

  private serverUrl: string = this.serverurl.getUrl();

  public post<T>(endpoint: string, header: HttpHeaders, body: string, credential: boolean): Observable<T> {
    const fullUrl: string = this.serverUrl + endpoint;
    console.log("Full url: " + fullUrl);
    console.log("Request type: post");
    console.log("Body: " + body);
    if (credential)
      return this.http.post<T>(fullUrl, body, { headers: header, observe: 'body', responseType: 'json', withCredentials: true });
    else 
      return this.http.post<T>(fullUrl, body, { headers: header, observe: 'body', responseType: 'json'});
  }
}
