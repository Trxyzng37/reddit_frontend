import { Injectable } from '@angular/core';
import { ServerUrlService } from '../server-url/server-url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetService {
  constructor(
    private serverurl: ServerUrlService, 
    private http: HttpClient
  ) {}

  private serverUrl: string = this.serverurl.getUrl();

  public get<T>(endpoint: string, header: HttpHeaders, credential: boolean): Observable<T> {
    const fullUrl: string = this.serverUrl + endpoint;
    console.log("Request type: get");
    if (credential)
      return this.http.get<T>(fullUrl, { headers: header, observe: 'body', responseType: 'json', withCredentials: true });
    else 
      return this.http.get<T>(fullUrl, { headers: header, observe: 'body', responseType: 'json'});
  }
}
