import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IsPasscodeMatch } from 'src/app/shared/pojo/is-passcode-match';
import { ConfirmEmailService } from '../../services/confirm-email/confirm-email.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IsSignUp } from '../../services/is-signup';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent {
  public email: string = localStorage.getItem("confirm_email") as string | "";

  public confirmEmailPasscodeForm: any = new FormGroup({
    passcode: new FormControl('', [Validators.pattern("^[0-9]{6}$")])
  })

  public constructor(
    private dateTimeService: DateTimeService,
    private router: Router,
    private confirmEmailService: ConfirmEmailService
  ) {}

  public confirmEmailPasscodeFormSubmit() {
    if (this.confirmEmailPasscodeForm.status === "VALID") {
      const passcode: number = this.confirmEmailPasscodeForm.value.passcode;
      const observable: Observable<IsPasscodeMatch> = this.confirmEmailService.checkConfirmEmailPasscode(passcode);
      observable.subscribe({
        next: (response: IsPasscodeMatch) => {
          if (response.isPasscodeExpired) {
            alert("Passcode expired");
          }
          else {
            if (response.isPasscodeMatch) {
              alert("Passcode CORRECT");
            }
            else 
              alert("Passcode FAIL");
          }
        },
        error: (e: HttpErrorResponse) => {
          console.log("HttpServletResponse: " + e.error.message + "\n" + "ResponseEntity: " + e.error);
        }
      })
    }
    else {
      alert("Incorrect passcode format")
    }
  }

  public reSendPasscode() {
    const observable: Observable<IsSignUp> = this.confirmEmailService.reSendPasscode(this.email);
    observable.subscribe({
      next: (response: IsSignUp) => {
        if (response.isSignUp) {
          alert("Create new passcode OK");
        }
        else {
          alert("Can not create new passcode");
        }
      },
      error: (e: HttpErrorResponse) => {
        alert("Make sure all field is follow requirements");
      }
    })
  }
}
