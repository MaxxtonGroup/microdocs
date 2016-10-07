/**
 * Created by Reinartz.T on 7-6-2016.
 */
import { OnInit, OnChanges, EventEmitter, IterableDiffers, QueryList, ChangeDetectorRef, SimpleChanges } from "@angular/core";
import { ColumnComponent } from "./column.component";
/**
 * DataTableComponent class,
 * used to show loads of data in an efficient manner.
 * at this moment its possible to have around 5.000 editable fields on a single page.
 */
export declare class DataTableComponent implements OnInit, OnChanges {
    private changeDetector;
    value: Object[];
    valueChange: EventEmitter<any>;
    selectionMode: string;
    selection: any;
    editable: boolean;
    onRowDblclick: EventEmitter<any>;
    scrollHeight: any;
    style: any;
    csvSeparator: string;
    differ: any;
    preventBlurOnEdit: boolean;
    private dataToRender;
    private filteredValue;
    private columns;
    private columnsUpdated;
    private activeCell;
    constructor(differs: IterableDiffers, cols: QueryList<ColumnComponent>, changeDetector: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    resolveFieldData(data: Array<Object>, column: ColumnComponent, _field?: string): any;
    updateFieldData(event: string | number, data: Array<any>, column: ColumnComponent): void;
    handleBlurOnFieldData(rowData: Array<Object>, col: ColumnComponent): void;
    updateDataToRender(datasource: Array<Object>): void;
    handleRowClick(event: MouseEvent, rowData: Array<Object>): void;
    rowDblclick(event: MouseEvent, rowData: Array<Object>): void;
    isSingleSelectionMode(): boolean;
    isMultipleSelectionMode(): boolean;
    findIndexInSelection(rowData: Object): number;
    isSelected(rowData: Array<Object>): boolean;
    switchCellToEditMode(rowIndex: number, colIndex: number, column: ColumnComponent): void;
    switchCellToViewMode(rowIndex: number, colIndex: number, column: ColumnComponent): void;
    onCellEditorKeydown(event: KeyboardEvent, column: ColumnComponent, rowData: Object, cell: HTMLElement): void;
    onTableKeydown(event: KeyboardEvent): void;
    switchNextOrPrevCellToEditMode(prev?: boolean): void;
    findCell(element: HTMLElement): HTMLElement;
    isEmpty(): boolean;
    visibleColumns(): ColumnComponent[];
    exportCSV(): void;
}
