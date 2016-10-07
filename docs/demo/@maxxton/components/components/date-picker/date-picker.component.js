System.register(["@angular/core", "@angular/common", "./date-picker-util"], function(exports_1, context_1) {
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
    var core_1, common_1, date_picker_util_1;
    var DatePickerComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (date_picker_util_1_1) {
                date_picker_util_1 = date_picker_util_1_1;
            }],
        execute: function() {
            DatePickerComponent = (function () {
                function DatePickerComponent() {
                    this.startDate = new Date();
                    this._selectedDate = null;
                    this.selectedDateChange = new core_1.EventEmitter();
                    this.minDate = new Date();
                    this.maxDate = null;
                    this.enabledDates = [];
                    this.enabledDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    // year = 1, month = 2, day = 3;
                    this.changeLevel = 3;
                    this.activeDate = new Date();
                    this.todayDate = new Date();
                    this.activeYear = this.activeDate.getFullYear();
                }
                Object.defineProperty(DatePickerComponent.prototype, "selectedDate", {
                    set: function (date) {
                        if (typeof date == "string") {
                            var tempDate = new Date(String(date));
                            if (tempDate.toString() != "Invalid Date" && +tempDate != +this._selectedDate) {
                                this.chooseDate(tempDate);
                            }
                        }
                        else if (date != null && +date != +this._selectedDate) {
                            this.chooseDate(date);
                        }
                        if (this._selectedDate != null) {
                            this.activeDate = this._selectedDate;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                DatePickerComponent.prototype.ngOnInit = function () {
                    //set current view to selected date;
                    if (this._selectedDate != null)
                        this.activeDate = new Date(this._selectedDate.getTime());
                    this.activeDate.setHours(0, 0, 0, 0);
                    this.todayDate.setHours(0, 0, 0, 0);
                    this.years = this.generateYears();
                    this.generateCalendar();
                };
                DatePickerComponent.prototype.ngOnChanges = function () {
                    this.generateCalendar();
                };
                DatePickerComponent.prototype.generateCalendar = function () {
                    //trick change detection to see the new active date;
                    this.activeDate = new Date(this.activeDate.getTime());
                    this.calendar = date_picker_util_1.DatePickerUtil.createMonthDates(this.activeDate.getFullYear(), this.activeDate.getMonth());
                };
                DatePickerComponent.prototype.changeMonth = function (month) {
                    if (month == -1) {
                        month = 11;
                        if (!this.changeYear(this.activeDate.getFullYear() - 1)) {
                            month = 0;
                        }
                    }
                    if (month == 12) {
                        month = 0;
                        if (!this.changeYear(this.activeDate.getFullYear() + 1)) {
                            month = 11;
                        }
                    }
                    if (!this.isMonthDisabled(month)) {
                        //change calendar view
                        if (this.changeLevel == 2)
                            this.changeLevel = 3;
                        this.activeDate.setMonth(month);
                        this.generateCalendar();
                    }
                };
                DatePickerComponent.prototype.changeYear = function (year) {
                    //trigger change detection
                    //check if year may be changed
                    if ((this.minDate == null || this.minDate.getFullYear() <= year) && (this.maxDate == null || this.maxDate.getFullYear() >= year)) {
                        this.activeDate.setFullYear(year);
                        this.activeDate = new Date(this.activeDate.getTime());
                        if (this.changeLevel == 1)
                            this.changeLevel = 2;
                        else if (this.changeLevel == 3)
                            this.generateCalendar();
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                DatePickerComponent.prototype.chooseDate = function (date) {
                    if (!this.isDateDisabled(date)) {
                        this._selectedDate = date;
                        this.selectedDateChange.emit(date);
                    }
                };
                DatePickerComponent.prototype.isDateDisabled = function (date) {
                    //check mindate
                    if (this.minDate != null && date.getTime() < this.minDate.getTime())
                        return true;
                    //check maxDate
                    if (this.maxDate != null && date.getTime() > this.maxDate.getTime())
                        return true;
                    return false;
                };
                DatePickerComponent.prototype.isMonthDisabled = function (month) {
                    return !((this.minDate == null || (this.minDate.getMonth() <= month || this.minDate.getFullYear() < this.activeDate.getFullYear())) &&
                        (this.maxDate == null || (this.minDate.getMonth() >= month || this.minDate.getFullYear() > this.activeDate.getFullYear())));
                };
                DatePickerComponent.prototype.isDaySelected = function (date) {
                    return (this._selectedDate != null && this.isMonthSelected(date) && this._selectedDate.getDate() == date.getDate());
                };
                DatePickerComponent.prototype.isMonthSelected = function (date) {
                    return (this._selectedDate != null && this._selectedDate.getFullYear() == date.getFullYear() && this._selectedDate.getMonth() == date.getMonth());
                };
                DatePickerComponent.prototype.getWeekNumber = function (date) {
                    //todo implement method to get week number from date
                    return 0;
                };
                DatePickerComponent.prototype.decreaseChangeLevel = function () {
                    if (this.changeLevel > 1)
                        this.changeLevel--;
                };
                DatePickerComponent.prototype.generateYears = function () {
                    var years = [];
                    var minYear = 1900;
                    var maxYear = 2100;
                    //set min/max year from min/max date
                    if (this.minDate != null)
                        minYear = this.minDate.getFullYear();
                    if (this.maxDate != null)
                        maxYear = this.maxDate.getFullYear();
                    for (var i = minYear; i < maxYear; i++) {
                        years.push(i);
                    }
                    return years;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Date)
                ], DatePickerComponent.prototype, "startDate", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], DatePickerComponent.prototype, "selectedDate", null);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DatePickerComponent.prototype, "selectedDateChange", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Date)
                ], DatePickerComponent.prototype, "minDate", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Date)
                ], DatePickerComponent.prototype, "maxDate", void 0);
                DatePickerComponent = __decorate([
                    core_1.Component({
                        selector: 'date-picker',
                        template:'<div class="selected-date"><p>{{_selectedDate | date:\'fullDate\'}}</p><p *ngIf="_selectedDate == null" class="no-date-selected">there is no date selected</p></div><div class="month selector grid-block"><div class="grid-block"><h6><a class="change-level" (click)="decreaseChangeLevel()" [class.primary]="changeLevel != 1"><i class="icon">arrow_back</i></a> <span *ngIf="changeLevel != 3">{{activeDate | date:\'y\'}}</span> <span *ngIf="changeLevel == 3">{{activeDate | date:\'MMMy\'}}</span></h6></div><div class="grid-block small-4 medium-3" *ngIf="changeLevel != 1"><template [ngIf]="changeLevel == 3"><a class="button small-5 no-margin no-padding" (click)="changeMonth(activeDate.getMonth() -1)"><i class="icon">chevron_left</i></a><div class="small-1"></div><a class="button small-5 no-margin no-padding" (click)="changeMonth(activeDate.getMonth() +1)"><i class="icon">chevron_right</i></a></template><template [ngIf]="changeLevel == 2"><a class="button small-5 no-margin no-padding" (click)="changeYear(activeDate.getFullYear() -1)"><i class="icon">chevron_left</i></a><div class="small-1"></div><a class="button small-5 no-margin no-padding" (click)="changeYear(activeDate.getFullYear() +1)"><i class="icon">chevron_right</i></a></template></div></div><div *ngIf="changeLevel == 1"><select [ngModel]="activeDate.getFullYear()" (ngModelChange)="changeYear($event);"><option *ngFor="let year of years" [value]="year">{{year}}</option></select></div><div *ngIf="changeLevel == 2" class="month-picker"><div class="grid-block small-up-4"><div class="grid-block"></div><div class="grid-block"></div><div class="grid-block"><a (click)="changeMonth(0)" class="date" [class.selected]="_selectedDate?.getMonth() == 0" [class.disabled]="isMonthDisabled(0)">jan</a></div><div class="grid-block"><a (click)="changeMonth(1)" class="date" [class.selected]="_selectedDate?.getMonth() == 1" [class.disabled]="isMonthDisabled(1)">feb</a></div></div><div class="grid-block small-up-4"><div class="grid-block"><a (click)="changeMonth(2)" class="date" [class.selected]="_selectedDate?.getMonth() == 2" [class.disabled]="isMonthDisabled(2)">mar</a></div><div class="grid-block"><a (click)="changeMonth(3)" class="date" [class.selected]="_selectedDate?.getMonth() == 3" [class.disabled]="isMonthDisabled(3)">apr</a></div><div class="grid-block"><a (click)="changeMonth(4)" class="date" [class.selected]="_selectedDate?.getMonth() == 4" [class.disabled]="isMonthDisabled(4)">may</a></div><div class="grid-block"><a (click)="changeMonth(5)" class="date" [class.selected]="_selectedDate?.getMonth() == 5" [class.disabled]="isMonthDisabled(5)">jun</a></div></div><div class="grid-block small-up-4"><div class="grid-block"><a (click)="changeMonth(6)" class="date" [class.selected]="_selectedDate?.getMonth() == 6" [class.disabled]="isMonthDisabled(6)">jul</a></div><div class="grid-block"><a (click)="changeMonth(7)" class="date" [class.selected]="_selectedDate?.getMonth() == 7" [class.disabled]="isMonthDisabled(7)">aug</a></div><div class="grid-block"><a (click)="changeMonth(8)" class="date" [class.se8ected]="_selectedDate?.getMonth() == 8" [class.disabled]="isMonthDisabled(8)">sept</a></div><div class="grid-block"><a (click)="changeMonth(9)" class="date" [class.selected]="_selectedDate?.getMonth() == 9" [class.disabled]="isMonthDisabled(9)">oct</a></div></div><div class="grid-block small-up-4"><div class="grid-block"><a (click)="changeMonth(10)" class="date" [class.selected]="_selectedDate?.getMonth() == 10" [class.disabled]="isMonthDisabled(10)">nov</a></div><div class="grid-block"><a (click)="changeMonth(11)" class="date" [class.selected]="_selectedDate?.getMonth() == 11" [class.disabled]="isMonthDisabled(11)">dec</a></div><div class="grid-block"></div><div class="grid-block"></div></div></div><template [ngIf]="changeLevel == 3"><div class="grid-block small-up-7"><div *ngFor="let dayName of calendar[0]" class="grid-block"><span>{{dayName | date:\'E\'}}</span></div></div><div *ngFor="let week of calendar"><div class="grid-block small-up-7"><div class="grid-block" *ngFor="let day of week; let i = index;"><a *ngIf="day.getMonth() == activeDate.getMonth()" (click)="chooseDate(day)" class="date" [class.selected]="isDaySelected(day)" [class.today]="day == todayDate" [class.disabled]="isDateDisabled(day)">{{ day | date:\'d\'}}</a></div></div></div></template>',
                        providers: [common_1.NgModel],
                        directives: [],
                        pipes: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], DatePickerComponent);
                return DatePickerComponent;
            }());
            exports_1("DatePickerComponent", DatePickerComponent);
        }
    }
});
