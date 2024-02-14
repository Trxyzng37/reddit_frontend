import { Component, OnInit, booleanAttribute } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SamePasswordValidator } from 'src/app/signup/directives/validators/same-password.directive';
import { ChangePasswordService } from '../../services/change-password.service';
import { CheckEmailService } from 'src/app/forgot-password/services/check-email/check-email.service';
import { Observable } from 'rxjs';
import { ChangePassword } from '../../services/change-password';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{
  public constructor (
    private router: Router,
    private changePasswordService: ChangePasswordService,
    private checkEmailService: CheckEmailService
  ) {};

  public ChangePasswordForm: FormGroup = new FormGroup ({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")]),
    reCheck: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")])
  }, {validators: SamePasswordValidator('newPassword', 'reCheck')})

  onSubmit(){
    if (this.ChangePasswordForm.status === "VALID") {
      const email: string = this.checkEmailService.getEmail();
      const password: string = this.ChangePasswordForm.value.newPassword;
      const observable: Observable<ChangePassword> = this.changePasswordService.changePassword(email, password);
      observable.subscribe({
        next: (obj: ChangePassword) => {
          const i: boolean = obj.changePassword; 
          if (String(i) === "true") {
            alert("Change password successfully")
          }
          else {
            alert("Can not change password")
          }
        },
        error: (e) => {
          alert("Error change password: " + e)
        }
      })
    }
    else {
      alert("Password is not the same");
    }
  }

  ngOnInit(): void {}
}
