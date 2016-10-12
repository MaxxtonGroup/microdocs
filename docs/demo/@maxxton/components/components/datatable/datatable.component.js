System.register(["@angular/core", "./column.component", "./column-template-loader.component", "../forms/auto-focus-input.directive"], function(exports_1, context_1) {
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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, column_component_1, column_template_loader_component_1, auto_focus_input_directive_1;
    var DataTableComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (column_component_1_1) {
                column_component_1 = column_component_1_1;
            },
            function (column_template_loader_component_1_1) {
                column_template_loader_component_1 = column_template_loader_component_1_1;
            },
            function (auto_focus_input_directive_1_1) {
                auto_focus_input_directive_1 = auto_focus_input_directive_1_1;
            }],
        execute: function() {
            /**
             * DataTableComponent class,
             * used to show loads of data in an efficient manner.
             * at this moment its possible to have around 5.000 editable fields on a single page.
             */
            DataTableComponent = (function () {
                function DataTableComponent(differs, cols, changeDetector) {
                    var _this = this;
                    this.changeDetector = changeDetector;
                    this.valueChange = new core_1.EventEmitter();
                    this.editable = false;
                    this.onRowDblclick = new core_1.EventEmitter();
                    this.csvSeparator = ",";
                    this.columnsUpdated = false;
                    this.activeCell = { row: null, column: null };
                    this.differ = differs.find([]).create(null);
                    cols.changes.subscribe(function () {
                        _this.columns = cols.toArray();
                        //check if there are editable fields, this means there are editable rows
                        _this.editable = false;
                        _this.columns.forEach(function (col) {
                            if (col.editable) {
                                _this.editable = true;
                            }
                        });
                        _this.columnsUpdated = true;
                    });
                }
                DataTableComponent.prototype.ngOnInit = function () {
                    if (this.value) {
                        this.updateDataToRender(this.value);
                    }
                };
                DataTableComponent.prototype.ngOnChanges = function (changes) {
                    this.updateDataToRender(this.filteredValue || this.value);
                };
                DataTableComponent.prototype.resolveFieldData = function (data, column, _field) {
                    if (_field === void 0) { _field = "field"; }
                    var field = column[_field];
                    if (data && field) {
                        if (column.direct) {
                            if (typeof field === "function") {
                                return field();
                            }
                            else {
                                return field;
                            }
                        }
                        if (field.indexOf(".") === -1) {
                            return data[field];
                        }
                        else {
                            var fields = field.split(".");
                            var value = data;
                            for (var i = 0, len = fields.length; i < len; ++i) {
                                if (value !== undefined) {
                                    value = value[fields[i]];
                                }
                            }
                            if (typeof value === "function") {
                                return value();
                            }
                            else {
                                return value;
                            }
                        }
                    }
                    else {
                        return null;
                    }
                };
                DataTableComponent.prototype.updateFieldData = function (event, data, column) {
                    var field = column.field;
                    //store field value, this gets reset after the input is blurred
                    if (!column.tempFieldData) {
                        column.tempFieldData = String(this.resolveFieldData(data, column));
                    }
                    if (data && field) {
                        if (field.indexOf(".") === -1) {
                            data[field] = event;
                        }
                        else {
                            var fields = field.split(".");
                            var value = data;
                            var len = fields.length;
                            for (var i = 0; i < len; ++i) {
                                if (i === len - 1) {
                                    value[fields[i]] = event;
                                }
                                else {
                                    value = value[fields[i]];
                                }
                            }
                        }
                        this.changeDetector.markForCheck();
                        this.valueChange.emit(this.value);
                    }
                };
                DataTableComponent.prototype.handleBlurOnFieldData = function (rowData, col) {
                    if (col.tempFieldData && rowData && col && col.proxy) {
                        var value = col.proxy(col.tempFieldData, this.resolveFieldData(rowData, col));
                        this.updateFieldData(value, rowData, col);
                    }
                    col.tempFieldData = null;
                };
                DataTableComponent.prototype.updateDataToRender = function (datasource) {
                    this.dataToRender = datasource;
                    this.changeDetector.markForCheck();
                };
                DataTableComponent.prototype.handleRowClick = function (event, rowData) {
                    var cell = this.findCell(event.target);
                    if (cell !== null) {
                        this.switchCellToEditMode(Number(cell.getAttribute("row")), Number(cell.getAttribute("col")), this.columns[cell.getAttribute("col")]);
                    }
                    this.changeDetector.markForCheck();
                };
                DataTableComponent.prototype.rowDblclick = function (event, rowData) {
                    this.onRowDblclick.emit({ originalEvent: event, data: rowData });
                    this.changeDetector.markForCheck();
                };
                DataTableComponent.prototype.isSingleSelectionMode = function () {
                    return this.selectionMode === "single";
                };
                DataTableComponent.prototype.isMultipleSelectionMode = function () {
                    return this.selectionMode === "multiple";
                };
                DataTableComponent.prototype.findIndexInSelection = function (rowData) {
                    var index = -1;
                    if (this.selectionMode && this.selection) {
                        if (this.isSingleSelectionMode()) {
                            index = (this.selection === rowData) ? 0 : -1;
                        }
                        else if (this.isMultipleSelectionMode()) {
                            for (var i = 0; i < this.selection.length; i++) {
                                if (this.selection[i] === rowData) {
                                    index = i;
                                    break;
                                }
                            }
                        }
                    }
                    return index;
                };
                DataTableComponent.prototype.isSelected = function (rowData) {
                    return this.findIndexInSelection(rowData) !== -1;
                };
                DataTableComponent.prototype.switchCellToEditMode = function (rowIndex, colIndex, column) {
                    if (this.editable || column.editable) {
                        this.activeCell = { row: rowIndex, column: colIndex };
                    }
                };
                DataTableComponent.prototype.switchCellToViewMode = function (rowIndex, colIndex, column) {
                    var _self = this;
                    if (_self.activeCell.row === rowIndex && _self.activeCell.column === colIndex) {
                        _self.activeCell = { row: null, column: null };
                    }
                };
                DataTableComponent.prototype.onCellEditorKeydown = function (event, column, rowData, cell) {
                    // this.onEdit.emit( { originalEvent: event, column: column, data: rowData } );
                    //enter
                    if (event.keyCode === 13) {
                        this.activeCell = { row: null, column: null };
                        this.preventBlurOnEdit = true;
                    }
                    //escape
                    if (event.keyCode === 27) {
                        this.activeCell = { row: null, column: null };
                        this.preventBlurOnEdit = true;
                    }
                    // up arrow
                    if (event.keyCode === 38) {
                        this.activeCell.row = this.activeCell.row - 1;
                    }
                    // down arrow
                    if (event.keyCode === 40) {
                        this.activeCell.row++;
                    }
                };
                DataTableComponent.prototype.onTableKeydown = function (event) {
                    if (event.keyCode === 9) {
                        event.preventDefault();
                        this.switchNextOrPrevCellToEditMode(event.shiftKey);
                    }
                };
                DataTableComponent.prototype.switchNextOrPrevCellToEditMode = function (prev) {
                    if (prev === void 0) { prev = false; }
                    var row = this.activeCell.row;
                    var column = this.activeCell.column;
                    if (!prev) {
                        column++;
                    }
                    else {
                        column--;
                    }
                    if (column === this.columns.length) {
                        column = 0;
                        row++;
                    }
                    if (column === 0) {
                        column = this.columns.length - 1;
                        row--;
                    }
                    if (this.columns[column].editable) {
                        this.activeCell.row = row;
                        this.activeCell.column = column;
                    }
                    else {
                        if (column !== 0 && row !== 0 && column !== this.columns.length && row !== this.dataToRender.length) {
                            this.switchNextOrPrevCellToEditMode(prev);
                        }
                    }
                };
                DataTableComponent.prototype.findCell = function (element) {
                    var cell = element;
                    while (cell !== null && cell.tagName !== "TD") {
                        if (cell.parentElement !== null) {
                            cell = cell.parentElement;
                        }
                        else {
                            cell = null;
                        }
                    }
                    return cell;
                };
                DataTableComponent.prototype.isEmpty = function () {
                    return !this.dataToRender || (this.dataToRender.length === 0);
                };
                DataTableComponent.prototype.visibleColumns = function () {
                    return this.columns.filter(function (c) { return !c.hidden; });
                };
                DataTableComponent.prototype.exportCSV = function () {
                    var _this = this;
                    var data = this.value, csv = "data:text/csv;charset=utf-8,";
                    //headers
                    for (var i = 0; i < this.columns.length; i++) {
                        if (this.columns[i].field) {
                            csv += this.columns[i].field;
                            if (i < (this.columns.length - 1)) {
                                csv += this.csvSeparator;
                            }
                        }
                    }
                    //body
                    this.value.forEach(function (record, i) {
                        csv += "\n";
                        for (var i_1 = 0; i_1 < _this.columns.length; i_1++) {
                            if (_this.columns[i_1].field) {
                                csv += _this.resolveFieldData(record, _this.columns[i_1]);
                                if (i_1 < (_this.columns.length - 1)) {
                                    csv += _this.csvSeparator;
                                }
                            }
                        }
                    });
                    window.open(encodeURI(csv));
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], DataTableComponent.prototype, "value", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DataTableComponent.prototype, "valueChange", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DataTableComponent.prototype, "selectionMode", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DataTableComponent.prototype, "selection", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DataTableComponent.prototype, "onRowDblclick", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DataTableComponent.prototype, "scrollHeight", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DataTableComponent.prototype, "style", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DataTableComponent.prototype, "csvSeparator", void 0);
                DataTableComponent = __decorate([
                    core_1.Component({
                        selector: "data-table",
                        template:'<table><thead><tr *ngIf="!headerRows" class="ui-state-default"><th *ngFor="let col of columns;" [class]="col.styleClass" [attr.colspan]="col.colspan" [style.display.none]="col.hidden"><span class="ui-column-title">{{col.header}}</span></th></tr><tr *ngFor="let headerRow of headerRows" class="ui-state-default"><th *ngFor="let col of headerRow.columns" [class]="col.styleClass" [style.display.none]="col.hidden"><span class="ui-column-title">{{col.header}}</span></th></tr></thead><tbody class="ui-datatable-data ui-widget-content"><tr (click)="handleRowClick($event, rowData);" (dblclick)="rowDblclick($event,rowData)" *ngFor="let rowData of dataToRender; let rowIndex = index"><td *ngFor="let col of columns; let colIndex = index; let a = false;" [ngStyle]="col.style" [attr.row]="rowIndex" [attr.col]="colIndex" [class]="col.styleClass" [class.pristine]="resolveFieldData(rowData, col, \'pristineField\')" [attr.colspan]="col.colspan" [style.display.hidden]="col.hidden" [ngClass]="{\'editable-column\': col.editable, \'focus\': td.hasFocus}" #td><template [ngIf]="!col.template"><span class="ui-cell-data" *ngIf="activeCell.row != rowIndex || !col.editable">{{resolveFieldData(rowData, col)}}</span> <input type="text" [auto-focus-input]="activeCell.row == rowIndex && activeCell.column == colIndex" *ngIf="activeCell.row == rowIndex && col.editable" class="ui-cell-editor ui-state-highlight" [ngModel]="resolveFieldData(rowData, col)" (ngModelChange)="updateFieldData($event, rowData, col)" (focus)="td.hasFocus = true; activeCell.column = colIndex;" (keydown)="onCellEditorKeydown($event, col, rowData, cell)" (blur)="td.hasFocus = false; handleBlurOnFieldData(rowData, col)"></template><p-column-template-loader *ngIf="col.template" [column]="col" [rowData]="rowData" [isRowActive]="activeCell.row == rowIndex" [isColActive]="activeCell.row == rowIndex && activeCell.column == colIndex" [rowIndex]="rowIndex"></p-column-template-loader></td></tr></tbody></table>',
                        directives: [column_template_loader_component_1.ColumnTemplateLoaderComponent, auto_focus_input_directive_1.AutoFocusInputDirective],
                    }),
                    __param(1, core_1.Query(column_component_1.ColumnComponent)), 
                    __metadata('design:paramtypes', [core_1.IterableDiffers, core_1.QueryList, core_1.ChangeDetectorRef])
                ], DataTableComponent);
                return DataTableComponent;
            }());
            exports_1("DataTableComponent", DataTableComponent);
        }
    }
});
