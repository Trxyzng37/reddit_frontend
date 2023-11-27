import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private getURL:string = "http://localhost:8080/home";
  constructor(private http: HttpClient) {}
  get_reponse(token: string): Observable<HttpResponse<string>>{
    let header: HttpHeaders = new HttpHeaders();
    let bearer_token = "Bearer " + token;
    console.log("TOKEN")
    console.log(bearer_token)
    let append_header: HttpHeaders = header.append("Authorization", bearer_token);
    console.log("This is the header with jwt token")
    console.log()
    return this.http.get(this.getURL, {headers: append_header, observe: "response", responseType: 'text'});
  }
}
