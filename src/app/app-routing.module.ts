import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { SigninComponent } from './signin/components/signin/signin.component';
import { SignupComponent } from './signup/components/signup/signup.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/components/home/home.component';
import { ForgotPasswordComponent } from './forgot-password/components/forgot-password/forgot-password.component';
import { PassCodeComponent } from './pass-code/components/pass-code/pass-code.component';
import { ChangePasswordComponent } from './change-password/components/change-password/change-password.component';

const routes: Routes = [
  // { path: 'signin', component: SigninComponent, canActivate: mapToCanActivate([signinGuard])},
  { path: 'signin', title: 'sign-in', component: SigninComponent},
  { path: 'signup', title: 'sign-up', component: SignupComponent},
  { path: 'forgot-password', title: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'pass-code', title: 'enter-passcode', component: PassCodeComponent},
  { path: 'change-password', title: 'change-password', component: ChangePasswordComponent},
  { path: 'home', title: 'home', component: HomeComponent },
  { path: 'error', title:'error', component: ErrorComponent },
  {path: '', redirectTo: 'signin', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


