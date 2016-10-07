System.register(["@angular/core"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var PaginationComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            PaginationComponent = (function () {
                function PaginationComponent() {
                    this.totalPages = 0;
                    this.currentPage = 0;
                    this.action = new core_1.EventEmitter();
                    //goto next page
                    this.nextPage = function () {
                        if (!this.lastPage) {
                            this.setPage(Number(this.currentPage) + 1);
                        }
                    };
                    //goto prev page
                    this.prevPage = function () {
                        if (!this.firstPage) {
                            this.setPage(Number(this.currentPage) - 1);
                        }
                    };
                    //set page to defined page number
                    this.setPage = function (setToPageNumber) {
                        if (setToPageNumber >= 0 && setToPageNumber != this.currentPage && setToPageNumber < this.totalPages) {
                            this.currentPage = setToPageNumber;
                            this.execScopeAction();
                        }
                    };
                    this.setRange();
                }
                Object.defineProperty(PaginationComponent.prototype, "firstPage", {
                    get: function () {
                        return this.currentPage == 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(PaginationComponent.prototype, "lastPage", {
                    get: function () {
                        return this.currentPage >= this.totalPages - 1;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                PaginationComponent.prototype.ngOnChanges = function (changes) {
                    this.setRange();
                };
                Object.defineProperty(PaginationComponent.prototype, "range", {
                    //generate a range of page numbers
                    get: function () {
                        return this._range;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                PaginationComponent.prototype.setRange = function () {
                    var rangeSize = 6;
                    var ps = [];
                    var start;
                    var totalPages = Number(this.totalPages) - 1; //-1 as the total pages count starts at 1 instead of 0;
                    var currentPage = Number(this.currentPage);
                    if (totalPages < rangeSize)
                        rangeSize = totalPages;
                    //push 4 other pages
                    start = Number(currentPage);
                    if (start > totalPages - rangeSize) {
                        start = totalPages - rangeSize + 1;
                    }
                    for (var i = start; i < start + rangeSize; i++) {
                        ps.push(i);
                    }
                    //push first page
                    if (currentPage > 0) {
                        ps.unshift(0);
                    }
                    //push last page
                    if (currentPage + rangeSize <= totalPages) {
                        ps.push(totalPages);
                    }
                    this._range = ps;
                };
                //handle page change navigation
                PaginationComponent.prototype.execScopeAction = function () {
                    this.action.emit(this.currentPage);
                };
                PaginationComponent.prototype.setPageForRoute = function (id, pageNum) {
                    // this.routerData.params[ 'page-' + id ] = pageNum.toString();
                    // return this.routerData.params;
                };
                PaginationComponent.prototype.getPageForRoute = function (id) {
                    // if ( this.routerData.params[ 'page-' + id ] !== undefined )
                    //   return Number( this.routerData.params[ 'page-' + id ] );
                    // else
                    return 0;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], PaginationComponent.prototype, "totalPages", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], PaginationComponent.prototype, "currentPage", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], PaginationComponent.prototype, "action", void 0);
                PaginationComponent = __decorate([
                    core_1.Component({
                        selector: 'pagination',
                        template:'<div class="grid-content noselect"><div class="pagination float-right"><a class="small button prev no-ink" (click)="prevPage()" ngClass="{\'disabled\': pagination.firstPage}">prev</a> <a class="small button no-ink" *ngFor="let n of range" [ngClass]="{\'disabled\': n == currentPage}" (click)="setPage(n)">{{n+1}}</a> <a class="small button next colored" (click)="nextPage()" ngClass="{\'disabled\': pagination.lastPage}">next</a></div></div>',
                        directives: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], PaginationComponent);
                return PaginationComponent;
            }());
            exports_1("PaginationComponent", PaginationComponent);
        }
    }
});
//
//export class Paging {
//  currentPage:number = 0;
//  totalPages:number = 0;
//
//  constructor(currentPage:number = 0, totalPages:number = 0){
//    this.currentPage = currentPage;
//    this.totalPages = totalPages;
//  }
//
//  setPage(currentPage:number = 0, totalPages:number = 0){
//    this.currentPage = currentPage;
//    this.totalPages = totalPages;
//  }
//} 
