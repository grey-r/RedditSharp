import { AbstractControl, ValidationErrors } from '@angular/forms';

const regex = /^[a-zA-Z_]*$/;
export function AlphaUnderValidator(control: AbstractControl): null| ValidationErrors {
    return regex.test(control.value) ? null : { text: "Invalid characters" };
}