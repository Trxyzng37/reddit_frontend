import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const SamePasswordValidator = (password: string, confirm_password: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordValue = control.get(password)?.value;
    const confirm_passwordValue = control.get(confirm_password)?.value;
    const check = passwordValue === confirm_passwordValue;
    return check ? null : { is_same_password: true };
  };
}