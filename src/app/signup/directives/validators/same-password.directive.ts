import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const SamePasswordValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
    const password = control.get('password');
    const confirm_password = control.get('confirm_password');

    const check = password && confirm_password && password.value === confirm_password.value;

    const password_element = document.getElementById('password');
    const confirm_password_element = document.getElementById('confirm_password');
    // if (!check) {
    //   password_element?.classList.add('ng-invalid');
    //   confirm_password_element?.classList.add('ng-invalid');
    // }
    // else {
    //   password_element?.classList.remove('ng-invalid');
    //   confirm_password_element?.classList.remove('ng-invalid');
    // }
    return  check ? null : {is_same_password: true};
  };