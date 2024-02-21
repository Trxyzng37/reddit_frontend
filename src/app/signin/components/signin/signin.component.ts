import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaderResponse, HttpHeaders, HttpResponse, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UsernamePasswordService } from '../../services/username-password/username-password.service';
import { ServerUrlService } from 'src/app/shared/services/server-url/server-url.service';
import { getCookie } from 'typescript-cookie';
import { Router } from '@angular/router';
import { Login } from '../../services/username-password/login';
import { Observable } from 'rxjs';
import { GoogleService } from '../../services/google/google.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent implements OnInit {
  constructor ( 
    private usernamePasswordService: UsernamePasswordService, 
    private googleService: GoogleService,
    private serverUrlService: ServerUrlService,
    private router: Router,
  ) {}

  private serverUrl: string = this.serverUrlService.getUrl();
  public signInForm: any = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(16), Validators.pattern("^[0-9a-zA-Z]{2,16}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")])
  })

  //when component first load
  ngOnInit(): void {
    const cookie: string|undefined = getCookie("login");
    if (cookie === undefined)  
      alert("No cookie login")
    else {
      try {
        const isLogin: Login = JSON.parse(cookie);
        // alert(isLogin.login)
        if (isLogin.login)
          alert("Login OK")
        else
          alert("Login FAIL")
      }
        catch (e) {
          alert("Error login using goolge. Please try login again")
        }
      }
    }

  //google login
  SignInUsingGoogle() {
    let endpoint: string = "/signin/google-authentication";
    window.location.href = `${this.serverUrl}${endpoint}`;
  }

  //when username-password form is submitted
  SignInFormSubmit() {
    if (this.signInForm.status == "VALID") {
      const username: string = this.signInForm.value.username;
      const password: string = this.signInForm.value.password;
      const observable: Observable<Login> = this.usernamePasswordService.signinByUsernamePassword(username, password);
      observable.subscribe({
        next: (response: Login) => {
          const isLogin: boolean = response.login;
          if (isLogin) {
            alert("login ok using username-password");
          }
          else {
            alert("login fail using username-password");
          }
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
  }
}

