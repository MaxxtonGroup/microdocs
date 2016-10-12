/**
 * Created by Reinartz.T on 8-8-2016.
 */
import { EventEmitter } from "@angular/core";
export declare class DragdropService {
    private data;
    dragNode: Element;
    onMouseMove: EventEmitter<{
        top: number;
        left: number;
    }>;
    onDragOver: EventEmitter<boolean>;
    dropped: EventEmitter<boolean>;
    setData(data: Object): void;
    getData(): Object;
    /**
     * set the node thats being dragged
     * @param node
     */
    setDragNode(node: Element): void;
}
