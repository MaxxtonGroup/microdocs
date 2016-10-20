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
    var ColumnComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ColumnComponent = (function () {
                function ColumnComponent() {
                    this.tempFieldData = null;
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ColumnComponent.prototype, "field", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ColumnComponent.prototype, "pristineField", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ColumnComponent.prototype, "editable", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ColumnComponent.prototype, "header", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], ColumnComponent.prototype, "colspan", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ColumnComponent.prototype, "styleClass", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ColumnComponent.prototype, "hidden", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ColumnComponent.prototype, "expander", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ColumnComponent.prototype, "direct", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Function)
                ], ColumnComponent.prototype, "proxy", void 0);
                __decorate([
                    core_1.ContentChild(core_1.TemplateRef), 
                    __metadata('design:type', core_1.TemplateRef)
                ], ColumnComponent.prototype, "template", void 0);
                ColumnComponent = __decorate([
                    core_1.Component({
                        selector: 'data-column',
                        template: ""
                    }), 
                    __metadata('design:paramtypes', [])
                ], ColumnComponent);
                return ColumnComponent;
            }());
            exports_1("ColumnComponent", ColumnComponent);
        }
    }
});
