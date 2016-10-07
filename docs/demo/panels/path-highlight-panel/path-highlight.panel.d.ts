import { ElementRef, SimpleChanges, OnChanges } from "@angular/core";
/**
 * @author Steven Hermans
 */
export declare class PathHighlightPanel implements OnChanges {
    private el;
    constructor(el: ElementRef);
    path: string;
    highlightPath: string;
    ngOnChanges(changes: SimpleChanges): void;
}
