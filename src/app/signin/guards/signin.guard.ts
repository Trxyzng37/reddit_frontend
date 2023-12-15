import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { JwtService } from 'src/app/shared/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class signinGuard {

  constructor(private router: Router, private jwtservice: JwtService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      let is_login: string = this.jwtservice.get_token();
      if (is_login == "")
        return true;
      else
        return false;
  }
}

// export const signinGuard: CanActivateFn = (route, state) => {
//   return inject(PermissionsService).canActivate(route, state);
// };
