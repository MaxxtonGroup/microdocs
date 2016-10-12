import { EventEmitter, OnInit, ElementRef, NgZone } from "@angular/core";
import { DragdropService } from "../../services/dragdrop.service";
/**
 * Created by Reinartz.T on 9-8-2016.
 */
export declare class DraggableComponent implements OnInit {
    element: ElementRef;
    private dragdropService;
    private zone;
    dragable: boolean;
    dragging: boolean;
    hidden: boolean;
    draggable: Object;
    dragElem: string;
    mouseup: EventEmitter<MouseEvent>;
    mousedown: EventEmitter<MouseEvent>;
    mousemove: EventEmitter<MouseEvent>;
    private clonedNode;
    private mousedrag;
    private lastMouseMove;
    private mouseIsDown;
    private mouseMoveSubscription;
    private mousedownSubscription;
    private mouseupSubscription;
    constructor(element: ElementRef, dragdropService: DragdropService, zone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onMouseup(event: MouseEvent): void;
    onMousedown(event: MouseEvent): boolean;
    onMousemove(event: MouseEvent): void;
    touchStart(event: TouchEvent): void;
    touchMove(event: TouchEvent): void;
    touchEnd(event: TouchEvent): void;
    handleSubscriptions(): void;
    startMouseListners(): void;
    touchHandler(event: TouchEvent): void;
}
