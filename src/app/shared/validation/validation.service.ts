import {Injectable} from "@angular/core";
import {AbstractControl} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})

export class ValidationService {
  public ValidateNumber(control: AbstractControl): {[key: string]: any} | null  {
    const regex = new RegExp('^[0-9]+$');
    if (control.value && !regex.test(control.value) && control.value.length > 0) {
      return { number: true };
    }
    return null;
  }

  public ValidateCharacter(control: AbstractControl): {[key: string]: any} | null  {
    const regex = new RegExp('^[a-zA-Z0-9 ]+$');
    if (control.value && !regex.test(control.value)) {
      return { character: true };
    }

    return null
  }

  public ValidateString(control: AbstractControl): {[key: string]: any} | null  {
    const regex = new RegExp('^[a-zA-Z ]+$');
    if (control.value && !regex.test(control.value)) {
      return { string: true };
    }

    return null
  }
}
