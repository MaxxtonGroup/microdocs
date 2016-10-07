/**
 * Created by Reinartz.T on 7-7-2016.
 */
import { ViewContainerRef, AfterContentInit, EventEmitter, SimpleChange } from "@angular/core";
/**
 * step component used to create a stepper component
 * see stepper component for usage
 */
export declare class StepComponent implements AfterContentInit {
    private _viewContainer;
    title: string;
    valid: boolean;
    loading: boolean;
    loadingChange: EventEmitter<boolean>;
    activate: EventEmitter<{}>;
    deActivate: EventEmitter<{}>;
    private _active;
    constructor(_viewContainer: ViewContainerRef);
    active: boolean;
    ngOnChanges(changes: {
        [key: string]: SimpleChange;
    }): void;
    setActiveState(value: boolean): void;
    ngAfterContentInit(): any;
}
