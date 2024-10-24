import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UsernamePasswordService } from '../../services/username-password/username-password.service';
import { ServerUrlService } from '../../../shared/services/server-url/server-url.service';
import { getCookie } from 'typescript-cookie';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GoogleSignInResponse } from '../../pojo/google-signin-response';
import { UsernamePasswordSignInResponse } from '../../pojo/username-password-signin-response';
import { StorageService } from 'src/app/shared/storage/storage.service';
import Swal from 'sweetalert2';
import { RecentVisitService } from 'src/app/shared/services/recent-visit/recent-visit.service';
import { DarkModeService } from 'src/app/shared/services/dark-mode/dark-mode.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent implements OnInit {
  constructor ( 
    private usernamePasswordService: UsernamePasswordService, 
    private serverUrlService: ServerUrlService,
    private router: Router,
    private storageService: StorageService,
    private recentVisitService: RecentVisitService,
    private darkmodeService: DarkModeService
  ) {}

  private serverUrl: string = this.serverUrlService.getUrl();
  public signInForm: any = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.pattern("^[0-9a-zA-Z@.-]{2,255}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")])
  })

  public username_status: string = 'INVALID';

  public isLoad: boolean = false;

  //when component first init
  ngOnInit(): void {
    this.signInForm.get('username').valueChanges.subscribe( () => {
      this.username_status = this.signInForm.get('username').status;
      // console.log("username: ", this.username_status);
    });

    const cookie: string = getCookie("GoogleSignIn") as string || "";
    const uid: number = getCookie("uid") == "0" ? 0 : Number.parseInt(getCookie("uid") as string || '0');
    if (cookie === "")  
      console.log("No cookie signin")
    else {
      try {
        const signin: GoogleSignInResponse = JSON.parse(cookie);
        if (signin.isGoogleSignIn) {
          this.storageService.setItem("uid", uid.toString());
          this.onSignIn();
        }
        else
          Swal.fire({
            title: "No account with this email",
            icon: "error",
            footer: "<b><a href='/signup'>Click here to create an account</a></b>"
          })
      }
        catch (e) {
          Swal.fire("Error signin using google. Please try again.",'','error')
        }
      }
    }

  //google login
  SignInUsingGoogle() {
    let endpoint: string = "/signin/google";
    window.location.href = `${this.serverUrl}${endpoint}`;
  }

  //when username-password form is submitted
  SignInFormSubmit() {
    if (this.signInForm.status == "VALID") {
      this.isLoad = true;
      const username: string = this.signInForm.value.username.toLowerCase();
      const password: string = this.signInForm.value.password;
      const observable: Observable<UsernamePasswordSignInResponse> = this.usernamePasswordService.signinByUsernamePassword(username, password);
      observable.subscribe({
        next: (response: UsernamePasswordSignInResponse) => {
          if (response.isSignIn) {
            this.storageService.setItem('uid', response.uid.toString());
            this.onSignIn();
            this.isLoad = false;
          }
          if (response.passwordError) {
            this.isLoad = false;
            Swal.fire("Wrong username or password",'','warning');
          }
        },
        error: (e: HttpErrorResponse) => {
          this.isLoad = false;
          Swal.fire("Error sign in. Please try again",'','error');
        }
      })
    }
  }

  onSignIn() {
    const uid = this.storageService.getItem("uid") == "" ? 0 : Number.parseInt(this.storageService.getItem("uid"));
    this.darkmodeService.useDarkMode();
    const recent_posts: number[] = this.storageService.getItem("recent_posts") == "" ? [] : JSON.parse("[" + this.storageService.getItem("recent_posts") + "]");
    for(let post of recent_posts) {
      this.recentVisitService.setRecentVisit("/set-recent-visit-post", uid, post).subscribe();
    }
    this.storageService.removeItem("recent_posts");
    const recent_communities: number[] = this.storageService.getItem("recent_communities") == "" ? [] : JSON.parse("[" + this.storageService.getItem("recent_communities") + "]");
    for(let community of recent_communities) {
      this.recentVisitService.setRecentVisit("/set-recent-visit-community", uid, community).subscribe();
    }
    this.storageService.removeItem("recent_communities");
    let timerInterval: any;
    Swal.fire({
      title: "Login successfully",
      html: "Redirecting to home page",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup()?.querySelector("b");
        timerInterval = setInterval(() => {
          timer!.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        // console.log("I was closed by the timer");
        window.location.href = "/home";
      }
    });
  }
}

