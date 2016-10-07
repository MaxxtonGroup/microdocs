/**
 * Created by Reinartz.T on 11-7-2016.
 */
import { ViewContainerRef } from "@angular/core";
export declare class TooltipContainerComponent {
    private top;
    private left;
    content: string;
    private hostView;
    constructor();
    setOptions(options: {
        content: string;
        hostView: ViewContainerRef;
    }): void;
}
