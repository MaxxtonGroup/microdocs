import { EventEmitter, OnChanges } from "@angular/core";
export declare class PaginationComponent implements OnChanges {
    totalPages: number;
    currentPage: number;
    action: EventEmitter<{}>;
    private _range;
    constructor();
    firstPage: boolean;
    lastPage: boolean;
    ngOnChanges(changes: {}): any;
    range: number[];
    private setRange();
    nextPage: () => void;
    prevPage: () => void;
    setPage: (setToPageNumber: number) => void;
    private execScopeAction();
    setPageForRoute(id: string, pageNum: number): any;
    getPageForRoute(id: string): number;
}
