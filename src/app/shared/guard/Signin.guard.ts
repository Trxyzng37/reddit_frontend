import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SignInGuard {

  constructor(
    private router: Router, 
    private storageService: StorageService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const uid: number = this.storageService.getItem("uid") == "" ? 0 : parseInt(this.storageService.getItem("uid"));
    if(uid==0) {
      return true;
    }
    else {
      this.router.navigate(['error']);
      return false;
    }
  }
}