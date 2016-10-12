/**
 * Created by Reinartz.T on 7-6-2016.
 */
import { ViewContainerRef, OnChanges, SimpleChange } from "@angular/core";
export declare class ColumnTemplateLoaderComponent implements OnChanges {
    private viewContainer;
    column: any;
    rowData: any;
    rowIndex: number;
    isRowActive: boolean;
    isColActive: boolean;
    pristine: boolean;
    constructor(viewContainer: ViewContainerRef);
    ngOnInit(): void;
    ngOnChanges(changes: {
        [key: string]: SimpleChange;
    }): void;
    setTemplate(): void;
}
