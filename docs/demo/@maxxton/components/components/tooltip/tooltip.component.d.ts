/**
 * Created by Reinartz.T on 11-7-2016.
 */
import { ViewContainerRef, ComponentResolver, SimpleChange } from "@angular/core";
export declare class TooltipComponent {
    private viewContainerRef;
    private loader;
    tooltip: string;
    private tooltipComponent;
    constructor(viewContainerRef: ViewContainerRef, loader: ComponentResolver);
    ngOnInit(): void;
    ngOnChanges(changes: {
        [key: string]: SimpleChange;
    }): void;
    setTooltip(tooltip: string): void;
    show(): void;
    hide(): void;
}
