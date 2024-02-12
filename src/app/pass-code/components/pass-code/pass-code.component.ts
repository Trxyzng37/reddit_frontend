import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckPasscodeService } from '../../services/check-passcode/check-passcode.service';
import { CheckEmailService } from 'src/app/forgot-password/services/check-email/check-email.service';
import { DateTimeService } from 'src/app/shared/services/date-time/date-time.service';

@Component({
  selector: 'app-pass-code',
  templateUrl: './pass-code.component.html',
  styleUrl: './pass-code.component.scss'
})
export class PassCodeComponent {
  public a: string = "trxyzng";
  public PasscodeForm: any = new FormGroup({
    passcode: new FormControl('', [Validators.pattern("^[0-9]{6}$")])
  })

  public constructor(
    private checkPasscodeService: CheckPasscodeService,
    private dateTimeService: DateTimeService
  ) {}

  onSubmit() {
    if (this.PasscodeForm.status === "VALID") {
      const passcode: number = this.PasscodeForm.value.passcode;
      this.checkPasscodeService.checkPasscode(passcode).subscribe({
        next: (body: any) => {
          alert(body.passcode_match);
          this.PasscodeForm.reset();
        },
        error: (e: any) => {
          alert(e.message)
        }
      })
    }
    else {
      alert("Incorrect passcode format")
    }
  }
}
