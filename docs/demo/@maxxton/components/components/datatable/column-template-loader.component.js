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
    var ColumnTemplateLoaderComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ColumnTemplateLoaderComponent = (function () {
                function ColumnTemplateLoaderComponent(viewContainer) {
                    this.viewContainer = viewContainer;
                }
                ColumnTemplateLoaderComponent.prototype.ngOnInit = function () {
                    this.setTemplate();
                };
                ColumnTemplateLoaderComponent.prototype.ngOnChanges = function (changes) {
                    if (changes['isRowActive']) {
                        this.setTemplate();
                    }
                };
                ColumnTemplateLoaderComponent.prototype.setTemplate = function () {
                    this.viewContainer.clear();
                    this.viewContainer.createEmbeddedView(this.column.template, {
                        '\$implicit': this.column,
                        'rowData': this.rowData,
                        'isRowActive': this.isRowActive,
                        'isColActive': this.isColActive,
                        'rowIndex': this.rowIndex
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ColumnTemplateLoaderComponent.prototype, "column", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ColumnTemplateLoaderComponent.prototype, "rowData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], ColumnTemplateLoaderComponent.prototype, "rowIndex", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ColumnTemplateLoaderComponent.prototype, "isRowActive", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ColumnTemplateLoaderComponent.prototype, "isColActive", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ColumnTemplateLoaderComponent.prototype, "pristine", void 0);
                ColumnTemplateLoaderComponent = __decorate([
                    core_1.Component({
                        selector: 'p-column-template-loader',
                        template: ""
                    }), 
                    __metadata('design:paramtypes', [core_1.ViewContainerRef])
                ], ColumnTemplateLoaderComponent);
                return ColumnTemplateLoaderComponent;
            }());
            exports_1("ColumnTemplateLoaderComponent", ColumnTemplateLoaderComponent);
        }
    }
});
