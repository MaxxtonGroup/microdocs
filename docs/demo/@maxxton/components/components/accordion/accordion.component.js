System.register(["@angular/core", "./accordion-item.component"], function(exports_1, context_1) {
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
    var core_1, accordion_item_component_1;
    var AccordionComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (accordion_item_component_1_1) {
                accordion_item_component_1 = accordion_item_component_1_1;
            }],
        execute: function() {
            AccordionComponent = (function () {
                function AccordionComponent(accodionComponents) {
                    this.accodionComponents = accodionComponents;
                    this.autoOpen = false;
                    this.collapsible = false;
                    this.multiOpen = false;
                    this.items = [];
                }
                AccordionComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.accodionComponents.changes.subscribe(function () {
                        //register accordions
                        _this.accodionComponents.toArray().forEach(function (tab) {
                            _this.addItem(tab);
                        });
                        //bind parent to children
                        _this.items.forEach(function (item) {
                            item.setAccordion(_this);
                        });
                    });
                };
                AccordionComponent.prototype.addItem = function (tab) {
                    if (this.items.length === 0 && this.autoOpen) {
                        tab.activate();
                    }
                    else {
                        tab.deactivate();
                    }
                    this.items.push(tab);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], AccordionComponent.prototype, "autoOpen", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], AccordionComponent.prototype, "collapsible", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], AccordionComponent.prototype, "multiOpen", void 0);
                AccordionComponent = __decorate([
                    core_1.Component({
                        selector: 'accordion',
                        template:'<div class="accordion ng-isolate-scope"><ng-content></ng-content></div>'
                    }),
                    __param(0, core_1.Query(accordion_item_component_1.AccordionItemComponent)), 
                    __metadata('design:paramtypes', [core_1.QueryList])
                ], AccordionComponent);
                return AccordionComponent;
            }());
            exports_1("AccordionComponent", AccordionComponent);
        }
    }
});
