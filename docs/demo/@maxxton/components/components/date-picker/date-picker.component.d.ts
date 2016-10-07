/**
 * Created by Reinartz.T on 15-4-2016.
 */
import { EventEmitter } from "@angular/core";
export declare class DatePickerComponent {
    startDate: Date;
    selectedDate: Date | string;
    private _selectedDate;
    selectedDateChange: EventEmitter<Date>;
    minDate: Date;
    maxDate: Date;
    enabledDates: Array<Date>;
    enabledDays: Array<string>;
    changeLevel: number;
    private calendar;
    private activeDate;
    private todayDate;
    private years;
    private activeYear;
    constructor();
    ngOnInit(): void;
    ngOnChanges(): void;
    generateCalendar(): void;
    changeMonth(month: number): void;
    changeYear(year: number): boolean;
    chooseDate(date: Date): void;
    isDateDisabled(date: Date): boolean;
    isMonthDisabled(month: number): boolean;
    isDaySelected(date: Date): boolean;
    isMonthSelected(date: Date): boolean;
    getWeekNumber(date: Date): number;
    decreaseChangeLevel(): void;
    generateYears(): number[];
}
