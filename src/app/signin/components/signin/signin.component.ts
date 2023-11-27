import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpHeaderResponse, HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { UsernamePasswordService } from '../../services/username-password/username-password.service';
import { JwtService } from 'src/app/shared/services/jwt.service';
import { GoogleAuthenticationService } from '../../services/google-authentication/google-authentication.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private googleAuthenticationService: GoogleAuthenticationService, private usernamePasswordService: UsernamePasswordService, private jwtService: JwtService) { }
  public signInForm: any;

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    })
    this.googleAuthenticationService.getGoogleJwtToken().subscribe({
      next: (reponse) => {
        if (reponse != null){
          if (reponse != '' || reponse == null){
            this.jwtService.set_token(reponse)
          }
          console.log('Check google jwt token:');
          console.log(reponse);
          let token = this.jwtService.get_token();
          if (token == '') {
            console.log('null');
          }
          else{
            console.log(token);
          }
        }
      }
    })
  }

  redirectToUrl() {
    window.location.href = "http://localhost:8080/signin/google-authentication";
  }

  // logout () {
  //   this.postService.get_reponse(this.jwtService.get_token()).subscribe({
  //     next: (reponse) => {
  //       if (reponse != null){
  //         console.log('Home endpoint...');
  //         let header: HttpHeaders = reponse.headers;
  //         console.log("Token: ", header)
  //       }
  //     }
  //   })
  // }

  onSubmit(){
      this.usernamePasswordService.login(this.signInForm.value.username, this.signInForm.value.password).subscribe({
        next: (reponse) => {
          if (reponse != null){
            console.log('Login successful...');
            this.jwtService.set_token(reponse.body);
            console.log("Token is: ", this.jwtService.get_token());
          }
        },
        error: (err) => {
          console.log(err);
        }

        //   // Handle successful login response
        //   console.log('Login successful...');
        //   this.jwtService.set_token(response.body);
        //   console.log("Token is: ", this.jwtService.get_token());
        // },
        // error: {
        //   // Handle login error
        //   console.log("Error: ");

        //   },
        //   complete: {
        //     console.log("End");
        //   }
        });
        
        }
}

