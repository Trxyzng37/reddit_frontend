import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetService } from 'src/app/shared/services/get/get.service';
import { Login } from '../username-password/login';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  constructor( 
    private http: HttpClient,
    private getService: GetService
  ) {}

  private endpoint: string = "/signin/google-authentication";

  signinByGoogle(): Observable<Login> {
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get<Login>(this.endpoint, header, true);
  }
}
