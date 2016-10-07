import { EventEmitter, ElementRef } from "@angular/core";
export declare class DropdownComponent {
    private elementRef;
    opened: boolean;
    onOpen: EventEmitter<boolean>;
    onClose: EventEmitter<boolean>;
    posTop: number;
    posLeft: number;
    parentNode: Element;
    node: Element;
    constructor(elementRef: ElementRef);
    setBodyAsRoot(): void;
    openDropdown(): void;
    closeDropdown(): void;
    toggle(): void;
}
