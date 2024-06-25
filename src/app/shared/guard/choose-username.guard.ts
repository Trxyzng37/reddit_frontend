import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChooseUsernameGuard {

  constructor(
    private router: Router, 
    private storageService: StorageService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const uid: number = this.storageService.getItem("signup_google_email") == "" ? 0 : parseInt(this.storageService.getItem("signup_google_email"));
    if(uid==1) {
      return true;
    }
    else {
      this.router.navigate(['error']);
      return false;
    }
  }
}