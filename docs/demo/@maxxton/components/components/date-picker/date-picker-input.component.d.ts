import { EventEmitter, SimpleChange } from "@angular/core";
import { Control } from "@angular/common";
/**
 * Created by Reinartz.T on 19-4-2016.
 */
export declare class DatePickerInputComponent {
    selectedDate: Date;
    selectedDateChange: EventEmitter<Date>;
    formControl: Control;
    minDate: Date;
    maxDate: Date;
    value: Date | string;
    private datePickerInputCtrl;
    disabled: boolean;
    showCalendar: boolean;
    top: number;
    left: number;
    required: boolean;
    constructor();
    /**
     *
     * update value of input field and datepicker
     * @param value
     */
    updateValue(value: string): void;
    /**
     * set the value if formcontrol is defined and holds a value;
     */
    ngOnInit(): void;
    /**
     * check for updates on the formcontrol
     * @param changes
     */
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
    onKeyDown(event: KeyboardEvent): void;
    calculateDatePickerPosition(element: Element): void;
    checkFields(): void;
}
