/**
 * Created by Reinartz.T on 9-8-2016.
 */
import { ElementRef, EventEmitter } from "@angular/core";
import { DragdropService } from "../../services/dragdrop.service";
export declare class DropzoneComponent {
    element: ElementRef;
    private dragdropService;
    dropStyle: "move" | "full";
    dropLayout: "grid" | "list";
    dropped: EventEmitter<Object>;
    dragggedOver: EventEmitter<boolean | Object>;
    clonedDragNode: HTMLElement;
    dropzone: boolean;
    dragOver: boolean;
    private lastPos;
    constructor(element: ElementRef, dragdropService: DragdropService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    hitTest(clientBounds: ClientRect): {
        x: number;
        y: number;
    };
    collideTest(rect1: ClientRect, rect2: ClientRect): boolean;
    moveHitTest(x: number, y: number): {
        x: number;
        y: number;
    };
    checkSideOfBounds(bounds: ClientRect, x: number, y: number): {
        x: number;
        y: number;
    };
    createCopyOfDragElementAtDropZone(before: boolean): void;
    removeClonedDragNode(): void;
    lastPosToBeforeBoolean(pos: {
        x: number;
        y: number;
    }): boolean;
}
