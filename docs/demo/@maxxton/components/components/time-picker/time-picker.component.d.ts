import { EventEmitter, ChangeDetectorRef } from "@angular/core";
export declare class TimePickerComponent {
    private cd;
    date: Date;
    dateChange: EventEmitter<Date>;
    private hours;
    private minutes;
    constructor(cd: ChangeDetectorRef);
    ngOnChanges(): void;
    private onHoursChanged(hours);
    private onMinutesChanged(minutes);
    private timeChanged();
}
