import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaderResponse, HttpHeaders, HttpResponse, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UsernamePasswordService } from '../../services/username-password/username-password.service';
import { ServerUrlService } from 'src/app/shared/services/server-url.service';
import { getCookie } from 'typescript-cookie';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent implements OnInit {
  constructor ( 
    private usernamePasswordService: UsernamePasswordService, 
    private serverUrlService: ServerUrlService
  ) {}

  private serverUrl: string = this.serverUrlService.getUrl();
  public signInForm: any = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(16), Validators.pattern("^[0-9a-zA-Z]{2,16}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")])
  })

  //when component first load
  ngOnInit(): void {}

  //google login
  redirectToUrl() {
    let endpoint: string = "/signin/google-authentication";
    window.location.href = `${this.serverUrl}${endpoint}`;
  }

  //when username-password form is submitted
  onSubmit() {
    if (this.signInForm.status == "VALID") {
      this.usernamePasswordService.login(this.signInForm.value.username, this.signInForm.value.password).subscribe({
        next: (response) => {
            console.log("login successfully using username-password");
            this.signInForm.reset();
        },
        error: (err) => {
          console.log("Error login using username password")
          console.log(err);
        }
      });
    }
  }
}

