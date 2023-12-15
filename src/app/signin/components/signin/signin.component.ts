import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaderResponse, HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { UsernamePasswordService } from '../../services/username-password/username-password.service';
import { JwtService } from 'src/app/shared/services/jwt.service';
import { GoogleAuthenticationService } from '../../services/google-authentication/google-authentication.service';
import { Router } from '@angular/router';
import { ServerUrlService } from 'src/app/shared/services/server-url.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor (
    private router: Router, 
    private googleAuthenticationService: GoogleAuthenticationService, 
    private usernamePasswordService: UsernamePasswordService, 
    private jwtService: JwtService,
    private serverUrlService: ServerUrlService
  ) { }

  public signInForm: any;
  private is_login: boolean|null = null;
  private serverUrl: string = this.serverUrlService.getUrl();

  //when component first load
  ngOnInit(): void {
    this.signInForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('')
    })
    this.googleAuthenticationService.getGoogleJwtToken().subscribe({
      next: (reponse) => {
        if (reponse != null){
          if (reponse != '' || reponse == null){
            this.jwtService.set_token(reponse)
          }
          console.log('Check google jwt token:');
          let token = this.jwtService.get_token();
          if (token == null) {
            console.log('null');
          }
          else{
            console.log(token);
            // this.router.navigate(["/signup"])
          }
        }
      }
    })
  }

  login(){
    this.router.navigate(["signup"]);
    console.log("not allow")
  }

  //google login
  redirectToUrl() {
    let endpoint: string = "/signin/google-authentication";
    window.location.href = `${this.serverUrl}${endpoint}`;
  }

  //when form is submitted
  onSubmit() {
    this.usernamePasswordService.login(this.signInForm.value.username, this.signInForm.value.password).subscribe({
      next: (response) => {
        if (response != null){
          console.log('Login successful...');
          this.jwtService.set_token(<string>response.body);
          console.log("Token is: ", this.jwtService.get_token());
          this.signInForm.reset();
          this.is_login = true;
          // this.router.navigate(["/home"]);
        }
      },
      error: (err) => {
        console.log("Error login using username password")
        this.is_login = false;
        console.log(err);
      }
    });
  }

  get username(){
    return this.signInForm.get("username");
  }
}

