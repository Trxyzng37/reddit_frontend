import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckEmailService } from '../../services/check-email/check-email.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  public constructor (
    private router: Router,
    private checkEmailService: CheckEmailService
  ) {};

  public ForgotPasswordForm: any = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  ngOnInit(): void {}

  onSubmit() {
    if (this.ForgotPasswordForm.status == "VALID") {
      const email = this.ForgotPasswordForm.value.email;
      this.checkEmailService.checkEmail(email).subscribe({
        next: (body: any) => {
          if (body.email === "true") {
            this.checkEmailService.setEmail(email);
            this.router.navigate(["/pass-code"]);
          }
          else 
            alert("Incorrect email address");
        },
        error: (e) => {
          alert("Error checking email");
        }
      })
    }
    else {
      alert("Incorrect email address format");
    }
  }
}
