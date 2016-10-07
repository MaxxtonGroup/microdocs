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
    var AccordionItemComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AccordionItemComponent = (function () {
                function AccordionItemComponent() {
                    this.title = null;
                    this.active = false;
                    this.activateChange = new core_1.EventEmitter();
                    this.deactivateChange = new core_1.EventEmitter();
                }
                AccordionItemComponent.prototype.activate = function () {
                    if (!this.active) {
                        this.deactivateAll();
                        this.active = true;
                        this.activateChange.emit(this.active);
                    }
                    else if (this.accordion && (this.accordion.collapsible || this.accordion.multiOpen)) {
                        this.deactivate();
                    }
                };
                AccordionItemComponent.prototype.deactivate = function () {
                    if (this.active) {
                        this.active = false;
                        this.deactivateChange.emit(this.active);
                    }
                };
                AccordionItemComponent.prototype.deactivateAll = function () {
                    if (this.accordion && this.accordion.multiOpen == false) {
                        this.accordion.items.forEach(function (item) {
                            item.deactivate();
                        });
                    }
                };
                AccordionItemComponent.prototype.setAccordion = function (accordion) {
                    this.accordion = accordion;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], AccordionItemComponent.prototype, "title", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AccordionItemComponent.prototype, "activateChange", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AccordionItemComponent.prototype, "deactivateChange", void 0);
                AccordionItemComponent = __decorate([
                    core_1.Component({
                        selector: 'accordion-item',
                        template:'<div class="accordion-item" [ngClass]="{\'is-active\': active}" title="{{title}}"><div class="accordion-title" (click)="activate()">{{title}}</div><div class="accordion-content" *ngIf="active"><ng-content></ng-content></div></div>'
                    }), 
                    __metadata('design:paramtypes', [])
                ], AccordionItemComponent);
                return AccordionItemComponent;
            }());
            exports_1("AccordionItemComponent", AccordionItemComponent);
        }
    }
});
