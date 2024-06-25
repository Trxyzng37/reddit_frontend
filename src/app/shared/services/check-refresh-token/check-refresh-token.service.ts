import { Injectable } from '@angular/core';
import { GetService } from '../get/get.service';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckRefreshTokenService {

  constructor(
    private getService: GetService
  ) { }

  private checkRefreshTokenEndpoint: string = "/check-refresh-token";

  public checkRefreshToken(): Observable<any> {
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(this.checkRefreshTokenEndpoint, header, true);
  }
}
