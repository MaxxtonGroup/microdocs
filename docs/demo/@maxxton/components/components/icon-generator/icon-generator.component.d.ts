import { ElementRef, Renderer } from "@angular/core";
/**
 * @author Steven Hermans
 */
export declare class IconGenerator {
    private el;
    private renderer;
    private text;
    private initials;
    colorRanges: {
        'pink': string[];
        'red': string[];
        'orange': string[];
        'amber': string[];
        'yellow': string[];
        'lime': string[];
        'green': string[];
        'teal': string[];
        'cyan': string[];
        'light-blue': string[];
        'blue': string[];
        'indigo': string[];
        'purple': string[];
    };
    constructor(el: ElementRef, renderer: Renderer);
    ngOnChanges(): void;
}
