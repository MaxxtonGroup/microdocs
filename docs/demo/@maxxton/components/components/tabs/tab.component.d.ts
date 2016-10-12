import { EventEmitter } from "@angular/core";
export declare class TabComponent {
    activate: EventEmitter<{}>;
    deActivate: EventEmitter<{}>;
    contentClass: string;
    showContentHeader: boolean;
    title: string;
    displayStyle: string;
    private _active;
    private _prevCondition;
    constructor();
    active: boolean;
    setActiveState(value: boolean): void;
}
