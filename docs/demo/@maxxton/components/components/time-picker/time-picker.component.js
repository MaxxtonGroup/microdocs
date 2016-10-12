System.register(["@angular/core", "../forms/field.component"], function(exports_1, context_1) {
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
    var core_1, field_component_1;
    var TimePickerComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (field_component_1_1) {
                field_component_1 = field_component_1_1;
            }],
        execute: function() {
            TimePickerComponent = (function () {
                function TimePickerComponent(cd) {
                    this.cd = cd;
                    this.dateChange = new core_1.EventEmitter();
                    this.hours = 0;
                    this.minutes = 0;
                }
                TimePickerComponent.prototype.ngOnChanges = function () {
                    if (this.date != null) {
                        this.hours = this.date.getHours();
                        this.minutes = this.date.getMinutes();
                    }
                };
                TimePickerComponent.prototype.onHoursChanged = function (hours) {
                    if (hours > 23)
                        hours = 23;
                    else if (hours < 0)
                        hours = 0;
                    this.hours = Number(hours);
                    this.cd.markForCheck();
                    this.timeChanged();
                };
                TimePickerComponent.prototype.onMinutesChanged = function (minutes) {
                    if (minutes > 59)
                        minutes = 59;
                    else if (minutes < 0)
                        minutes = 0;
                    this.minutes = Number(minutes);
                    this.cd.markForCheck();
                    this.timeChanged();
                };
                TimePickerComponent.prototype.timeChanged = function () {
                    if (this.date != null) {
                        this.date.setHours(this.hours);
                        this.date.setMinutes(this.minutes);
                        this.dateChange.emit(this.date);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Date)
                ], TimePickerComponent.prototype, "date", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], TimePickerComponent.prototype, "dateChange", void 0);
                TimePickerComponent = __decorate([
                    core_1.Component({
                        selector: 'time-picker',
                        template:'<div class="grid-block horizontal"><field label="Hours" class="small-6"><input type="number" max="23" min="0" (ngModelChange)="onHoursChanged($event)" [ngModel]="hours"></field><field label="Minutes" class="small-6"><input type="number" max="59" min="0" (ngModelChange)="onMinutesChanged($event)" [ngModel]="minutes"></field></div>',
                        directives: [field_component_1.FieldComponent]
                    }), 
                    __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
                ], TimePickerComponent);
                return TimePickerComponent;
            }());
            exports_1("TimePickerComponent", TimePickerComponent);
        }
    }
});
