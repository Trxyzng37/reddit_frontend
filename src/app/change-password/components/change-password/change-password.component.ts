import { Component, OnInit, booleanAttribute } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SamePasswordValidator } from 'src/app/signup/directives/validators/same-password.directive';
import { ChangePasswordService } from '../../services/change-password.service';
import { EmailExistService } from 'src/app/forgot-password/services/email-exist/check-email.service';
import { Observable } from 'rxjs';
import { ChangePasswordResponse } from '../../pojo/change-password-response';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../../shared/storage/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{
  public constructor (
    private router: Router,
    private changePasswordService: ChangePasswordService,
    private storageService: StorageService
  ) {};

  public ChangePasswordForm: FormGroup = new FormGroup ({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")]),
    reCheck: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z ~`!@#$%^&*()_+={[}]|\\:;\"'<,>.?/-]{8,20}$")])
  }, {validators: SamePasswordValidator('newPassword', 'reCheck')})

  onSubmit(){
    if (this.ChangePasswordForm.status === "VALID") {
      const password: string = this.ChangePasswordForm.value.newPassword;
      const email: string = this.storageService.getItem("forgot-password-email");
      if (email === "")
        Swal.fire("Error changing password. Please try again",'','error');
      else {
        const observable: Observable<ChangePasswordResponse> = this.changePasswordService.changePassword(email, password);
        observable.subscribe({
          next: (response: ChangePasswordResponse) => {
            if (response.isPasswordChange) {
              Swal.fire("Change password successfully",'','success')
              this.storageService.removeItem("forgot-password-email");
              this.router.navigate(['/signin'])
            }
            if (!response.isPasswordChange) {
              Swal.fire("Old and new password can not be the same",'','warning');
            }
          },
          error: (e: HttpErrorResponse) => {
            Swal.fire("Error changing password. Please try again",'','error');
            console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
          }
        })
      }
    }
    else {
      Swal.fire("Field value is not the same",'','warning');
    }
  }

  ngOnInit(): void {}
}
