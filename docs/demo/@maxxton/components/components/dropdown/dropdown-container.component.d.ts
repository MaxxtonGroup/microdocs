import { QueryList, ViewContainerRef } from "@angular/core";
import { DropdownComponent } from "./dropdown.component";
export declare class DropdownContainerComponent {
    private viewContainerRef;
    constructor(viewContainerRef: ViewContainerRef);
    contentChildren: QueryList<DropdownComponent>;
    ngAfterContentInit(): void;
}
