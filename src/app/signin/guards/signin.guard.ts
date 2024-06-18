import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AccessTokenService } from 'src/app/shared/services/access-token/access-token.service';

@Injectable({
  providedIn: 'root'
})
export class signinGuard {

  constructor(private router: Router, private accessTokenService: AccessTokenService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const a: number = 1;
    if(a==0) {
        this.router.navigate(['error']);
        return false;
    }
    else {
        return true;
    }
  }
}