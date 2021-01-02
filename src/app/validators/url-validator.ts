import { AbstractControl, ValidationErrors } from '@angular/forms';

export function URLValidator(control: AbstractControl): null | ValidationErrors {
    let validUrl = true;

    try {
      new URL(control.value)
    } catch {
      validUrl = false;
    }

    return validUrl ? null : { url: "Invalid URL" };
}
