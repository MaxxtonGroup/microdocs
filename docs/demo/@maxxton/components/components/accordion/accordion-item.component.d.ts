/**
 * Created by Reinartz.T on 22-6-2016.
 */
import { EventEmitter } from "@angular/core";
import { AccordionComponent } from "./accordion.component";
export declare class AccordionItemComponent {
    title: string;
    active: boolean;
    activateChange: EventEmitter<{}>;
    deactivateChange: EventEmitter<{}>;
    private accordion;
    activate(): void;
    deactivate(): void;
    private deactivateAll();
    setAccordion(accordion: AccordionComponent): void;
}
