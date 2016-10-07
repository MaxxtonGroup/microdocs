/**
 * Created by Reinartz.T on 22-6-2016.
 */
import { QueryList } from "@angular/core";
import { AccordionItemComponent } from "./accordion-item.component";
export declare class AccordionComponent {
    private accodionComponents;
    autoOpen: boolean;
    collapsible: boolean;
    multiOpen: boolean;
    items: Array<AccordionItemComponent>;
    constructor(accodionComponents: QueryList<AccordionItemComponent>);
    ngOnInit(): void;
    addItem(tab: AccordionItemComponent): void;
}
