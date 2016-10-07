import { ElementRef, EventEmitter } from "@angular/core";
export declare class FancyListItemComponent {
    private elem;
    title: string;
    smallTitle: string;
    icon: string;
    meta: string;
    content: any;
    status: any;
    canFocus: boolean;
    link: Array<string>;
    onFocus: EventEmitter<boolean>;
    hasFocus: boolean;
    constructor(elem: ElementRef);
    private hasIcon;
    private hasMeta;
    setFocus(): void;
}
