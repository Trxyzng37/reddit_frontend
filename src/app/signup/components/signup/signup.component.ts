import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {SignupService} from '../../services/signup.service'
import { SamePasswordValidator } from '../../directives/validators/same-password.directive';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: any = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(16), Validators.pattern("^[0-9a-zA-Z]{2,16}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")]),
    confirm_password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")])
  }, {validators: SamePasswordValidator('password', 'confirm_password')})

  constructor (
    private signUpService: SignupService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.signUpForm.status == "VALID") {
      console.log("Form input valid. Send signup request to server")
      this.signUpService.signup(this.signUpForm.value.username, this.signUpForm.value.password, this.signUpForm.value.email).subscribe({
        next: (response) => {
          console.log("Sign up successfully");
          this.signUpForm.reset();
        },
        error: (e) => {
          console.log("Error sign up:")
          console.log(e)
        }
      });
    }
    else {
      alert("Make sure all field is follow requirements");
    }
  }
}
