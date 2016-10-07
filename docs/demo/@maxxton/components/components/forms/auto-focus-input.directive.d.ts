/**
 * Created by Reinartz.T on 6-6-2016.
 */
import { ElementRef, NgZone, Renderer } from "@angular/core";
export declare class AutoFocusInputDirective {
    elem: ElementRef;
    private zone;
    private renderer;
    autoFocusInput: boolean;
    private firstTime;
    constructor(elem: ElementRef, zone: NgZone, renderer: Renderer);
    ngAfterViewInit(): void;
}
