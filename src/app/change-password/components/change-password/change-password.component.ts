import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SamePasswordValidator } from 'src/app/signup/directives/validators/same-password.directive';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{
  public constructor (
    private router: Router
  ) {};

  public ChangePasswordForm: FormGroup = new FormGroup ({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")]),
    reCheck: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")])
  }, {validators: SamePasswordValidator('newPassword', 'reCheck')})

  onSubmit(){
    if (this.ChangePasswordForm.status === "VALID") {
      alert("OK");
    }
    else {
      alert("Password is not the same");
    }
  }

  ngOnInit(): void {}
}
