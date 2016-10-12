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
System.register(["@angular/core", "@angular/common"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1;
    var nextInputId, FieldComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            /**
             * Monotonically increasing integer used to auto-generate unique ids for checkbox components.
             */
            nextInputId = 0;
            FieldComponent = (function () {
                function FieldComponent(eltRef) {
                    this.eltRef = eltRef;
                    this.type = 'text';
                    this.customInvalidMessage = null;
                }
                FieldComponent.prototype.ngAfterContentChecked = function () {
                    var inputArray = this.eltRef.nativeElement.getElementsByTagName('input');
                    if (inputArray.length && inputArray[0].type != null) {
                        this.type = inputArray[0].type;
                    }
                };
                FieldComponent.prototype.isStateNotValid = function () {
                    return this.label && this.state && !this.state.valid
                        && !this.state.control.pending;
                };
                FieldComponent.prototype.isFeedbackValid = function () {
                    return this.state && this.feedback && !this.state.control.pending && this.state.valid;
                };
                FieldComponent.prototype.isFeedbackNotValid = function () {
                    return this.state && this.feedback && !this.state.control.pending && !this.state.valid;
                };
                FieldComponent.prototype.isFeedbackPending = function () {
                    return this.state && this.feedback && this.state.control.pending;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FieldComponent.prototype, "label", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FieldComponent.prototype, "description", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], FieldComponent.prototype, "feedback", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FieldComponent.prototype, "customInvalidMessage", void 0);
                __decorate([
                    core_1.ContentChild(common_1.NgFormControl), 
                    __metadata('design:type', common_1.NgFormControl)
                ], FieldComponent.prototype, "state", void 0);
                FieldComponent = __decorate([
                    core_1.Component({
                        selector: 'field',
                        template:'<div [ngClass]="{\'has-error\':state && !state?.valid && !state?.control.pending && state?.touched, \'has-feedback\':feedback}" [class]="type"><label *ngIf="label"><h6><span *ngIf="type == \'checkbox\'" class="icon">{{state?.value ? \'check_box\':\'check_box_outline_blank\'}}</span> {{label}} {{description}}</h6><span class="inline-label"><span class="form-label" [hidden]="type == \'checkbox\'"><span *ngIf="isFeedbackValid()" class="icon warning" aria-hidden="true">check</span> <span *ngIf="isFeedbackNotValid()" class="icon warning" aria-hidden="true">warning</span> <span *ngIf="isFeedbackPending()" class="icon warning" aria-hidden="true">warning</span> <span *ngIf="isStateNotValid()" class="icon info">info_outline</span> <span *ngIf="state?.valid" class="icon success">check</span></span><ng-content></ng-content></span></label> <span class="label warning" *ngIf="state?.errors?.required && state?.touched">{{label || \'This field\'}} is required</span> <span class="label warning" *ngIf="state?.errors?.remote">{{state?.errors?.remote}}</span> <span class="label warning" *ngIf="state?.errors?.uniqueName && state?.touched">The name must be unique</span> <span class="label warning" *ngIf="state?.errors?.invalidZip && state?.touched">The zip code format isn\'t correct</span> <span class="label warning" *ngIf="state?.value?.length > 0 && !state?.valid && state?.touched && customInvalidMessage != null">{{customInvalidMessage}}</span></div>'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], FieldComponent);
                return FieldComponent;
            }());
            exports_1("FieldComponent", FieldComponent);
        }
    }
});
//maxlengt
//minlengt
//type check
//- text
//- number
//- email
//- creditcard
//- href
//- password
//required
//checkbox
//radio group
//
