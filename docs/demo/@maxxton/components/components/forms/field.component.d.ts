/**
 * Input field wrapper to add feedback and label to this input.
 * This should be used when you would like to use forms that supply feedback or if you would like to validate forms.
 *
 * How to use this.
 * template
 * <form #form="ngForm" [ngFormModel]="myForm" (submit)="logForm(demo)">
 *    <field label="Username">
 *     <input type="text" [ngFormControl]="myForm.controls.name" placeholder="Username"/>
 *   </field>
 *   <button type="submit" [ngClass]="{'disabled': !demo.valid}">submit form</button>
 * </form>
 *
 * typescript
 * in your constructor place
 * this.myForm = formBuilder.group({
 *   name: ["", Validators.required],
 * })
 *
 * the validator of name will be linked to the input field via ngFormControl and the form automatically checks and updates the status of this form
 *
 * Created by Reinartz.T on 22-3-2016.
 */
import { ElementRef } from "@angular/core";
import { NgFormControl } from "@angular/common";
export declare class FieldComponent {
    private eltRef;
    type: string;
    label: string;
    description: string;
    feedback: boolean;
    customInvalidMessage: string;
    state: NgFormControl;
    constructor(eltRef: ElementRef);
    ngAfterContentChecked(): void;
    isStateNotValid(): boolean;
    isFeedbackValid(): boolean;
    isFeedbackNotValid(): boolean;
    isFeedbackPending(): boolean;
}
