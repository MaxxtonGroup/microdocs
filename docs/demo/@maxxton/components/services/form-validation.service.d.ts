import { NgFormControl } from "@angular/common";
/**
 * Exports of all helpers
 * @author R. Reinartz (r.reinartz@maxxton.com)
 */
export declare class FormValidationService {
    static getValidatorErrorMessage(code: string): string;
    static creditCardValidator(control: NgFormControl): {
        'invalidCreditCard': boolean;
    };
    static emailValidator(control: NgFormControl): {
        'invalidEmailAddress': boolean;
    };
    static passwordValidator(control: NgFormControl): {
        'invalidPassword': boolean;
    };
}
