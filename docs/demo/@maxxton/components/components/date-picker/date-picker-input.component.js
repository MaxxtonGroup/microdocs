System.register(["@angular/core", "@angular/common", "./date-picker.component"], function(exports_1, context_1) {
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
    var core_1, common_1, date_picker_component_1;
    var DatePickerInputComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (date_picker_component_1_1) {
                date_picker_component_1 = date_picker_component_1_1;
            }],
        execute: function() {
            /**
             * Created by Reinartz.T on 19-4-2016.
             */
            DatePickerInputComponent = (function () {
                function DatePickerInputComponent() {
                    this.selectedDate = null;
                    this.selectedDateChange = new core_1.EventEmitter();
                    this.formControl = null;
                    this.minDate = null;
                    this.maxDate = null;
                    this.value = this.selectedDate;
                    this.disabled = false;
                    this.showCalendar = false;
                    this.required = false;
                    this.datePickerInputCtrl = new common_1.Control('');
                }
                /**
                 *
                 * update value of input field and datepicker
                 * @param value
                 */
                DatePickerInputComponent.prototype.updateValue = function (value) {
                    this.value = new Date(value);
                    this.selectedDateChange.emit(this.value);
                    if (this.formControl != null) {
                        this.formControl.updateValue(this.value);
                    }
                };
                /**
                 * set the value if formcontrol is defined and holds a value;
                 */
                DatePickerInputComponent.prototype.ngOnInit = function () {
                    this.checkFields();
                };
                /**
                 * check for updates on the formcontrol
                 * @param changes
                 */
                DatePickerInputComponent.prototype.ngOnChanges = function (changes) {
                    if (changes['formControl'] || changes['selectedDate']) {
                        this.checkFields();
                    }
                };
                DatePickerInputComponent.prototype.onKeyDown = function (event) {
                    if (this.showCalendar && event.keyCode === 9) {
                        this.showCalendar = false;
                    }
                };
                DatePickerInputComponent.prototype.calculateDatePickerPosition = function (element) {
                    if (this.showCalendar) {
                        var rect = element.getBoundingClientRect();
                        this.left = rect.left;
                        //height 372
                        if (rect.top + 500 > window.outerHeight) {
                            this.top = rect.top - 380;
                        }
                        else {
                            this.top = rect.top + rect.height + 10;
                        }
                    }
                };
                DatePickerInputComponent.prototype.checkFields = function () {
                    if (this.formControl != null && this.formControl.value != null) {
                        this.value = new Date(this.formControl.value.getTime());
                    }
                    if (this.selectedDate != null) {
                        this.value = new Date(this.selectedDate.getTime());
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Date)
                ], DatePickerInputComponent.prototype, "selectedDate", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DatePickerInputComponent.prototype, "selectedDateChange", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', common_1.Control)
                ], DatePickerInputComponent.prototype, "formControl", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Date)
                ], DatePickerInputComponent.prototype, "minDate", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Date)
                ], DatePickerInputComponent.prototype, "maxDate", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], DatePickerInputComponent.prototype, "disabled", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], DatePickerInputComponent.prototype, "required", void 0);
                __decorate([
                    core_1.HostListener('window:keydown', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [KeyboardEvent]), 
                    __metadata('design:returntype', void 0)
                ], DatePickerInputComponent.prototype, "onKeyDown", null);
                __decorate([
                    core_1.HostListener('window:scroll', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Element]), 
                    __metadata('design:returntype', void 0)
                ], DatePickerInputComponent.prototype, "calculateDatePickerPosition", null);
                DatePickerInputComponent = __decorate([
                    core_1.Component({
                        selector: 'date-picker-input',
                        template:'<div class="hidden-overlay" (click)="showCalendar = false" [hidden]="!showCalendar"></div><input type="text" [ngModel]="value | date:\'shortDate\'" [disabled]="disabled" [required]="required" [ngFormControl]="datePickerInputCtrl" (ngModelChange)="datePicker.selectedDate = $event" placeholder="dd-mm-yyyy" (focus)="showCalendar = true; calculateDatePickerPosition($event.srcElement)" (click)="showCalendar = true; calculateDatePickerPosition($event.srcElement)" #input><date-picker #datePicker [selectedDate]="value" (selectedDateChange)="showCalendar = false; updateValue($event)" class="inline" [minDate]="minDate" [maxDate]="maxDate" [style.top.px]="top" [style.left.px]="left" [hidden]="!showCalendar"></date-picker>',
                        directives: [date_picker_component_1.DatePickerComponent],
                        pipes: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], DatePickerInputComponent);
                return DatePickerInputComponent;
            }());
            exports_1("DatePickerInputComponent", DatePickerInputComponent);
        }
    }
});
