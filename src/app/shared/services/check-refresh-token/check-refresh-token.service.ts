import { Injectable } from '@angular/core';
import { GetService } from '../get/get.service';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { StorageService } from '../../storage/storage.service';
import { RemoveRefreshTokenService } from '../remove-refresh-token/remove-refresh-token.service';

@Injectable({
  providedIn: 'root'
})
export class CheckRefreshTokenService {

  constructor(
    private getService: GetService,
    private storageService: StorageService,
    private removeRefreshTokenService: RemoveRefreshTokenService,
  ) { }

  private checkRefreshTokenEndpoint: string = "/check-refresh-token";

  public checkRefreshToken(): Observable<any> {
    const header: HttpHeaders = new HttpHeaders();
    return this.getService.get(this.checkRefreshTokenEndpoint, header, true);
  }

  public runCheckRefreshToken() {
    this.checkRefreshToken().subscribe({
      next: (response: number) => {
        if(response != 0) {
          this.storageService.setItem("uid", response.toString());
        }
      },
      error: (e: HttpErrorResponse) => {
        this.storageService.removeItem("uid");
        this.storageService.setItem("mode", "0");
        this.removeRefreshTokenService.removeRefreshToken().subscribe();
        Swal.fire({
          title: "You need to sign-in to do this action",
          icon: "error",
          showConfirmButton: true,
          confirmButtonText: "OK",
          footer: '<a href="signin" style="color:red;font-size: 18px"><b>Click here to go to sign-in page<b/></a>'
        }).then((result) => {
          if(result.isDismissed) {
            window.location.reload();
          }
        })
      }
    })
  }

  public runCheckRefreshTokenWithoutNotification() {
    this.checkRefreshToken().subscribe({
      next: (response: any) => {
        if(response != 0) {
          this.storageService.setItem("uid", response.toString());
        }
      },
      error: (e: HttpErrorResponse) => {
        this.storageService.removeItem("uid");
        this.storageService.setItem("mode", "0");
        this.removeRefreshTokenService.removeRefreshToken().subscribe();
      }
    })
  }
}
