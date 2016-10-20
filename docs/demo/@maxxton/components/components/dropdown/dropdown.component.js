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
    var DropdownComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            DropdownComponent = (function () {
                function DropdownComponent(elementRef) {
                    this.elementRef = elementRef;
                    this.opened = false;
                    this.onOpen = new core_1.EventEmitter();
                    this.onClose = new core_1.EventEmitter();
                    this.posTop = null;
                    this.posLeft = null;
                    this.parentNode = null;
                    this.node = null;
                }
                DropdownComponent.prototype.setBodyAsRoot = function () {
                    if (this.parentNode == null) {
                        this.parentNode = this.elementRef.nativeElement.parentNode;
                    }
                    this.node = this.elementRef.nativeElement;
                    document.body.appendChild(this.node);
                };
                DropdownComponent.prototype.openDropdown = function () {
                    var _this = this;
                    if (!this.opened) {
                        _this.opened = true;
                        this.onOpen.emit(true);
                    }
                };
                DropdownComponent.prototype.closeDropdown = function () {
                    if (this.opened) {
                        this.opened = false;
                        this.onClose.emit(true);
                        this.posTop = null;
                        this.posLeft = null;
                        if (this.parentNode && this.node) {
                            this.parentNode.appendChild(this.node);
                        }
                    }
                };
                DropdownComponent.prototype.toggle = function () {
                    if (!this.opened)
                        this.openDropdown();
                    else
                        this.closeDropdown();
                    //this.opened = !this.opened;
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DropdownComponent.prototype, "onOpen", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DropdownComponent.prototype, "onClose", void 0);
                DropdownComponent = __decorate([
                    core_1.Component({
                        selector: 'dropdown',
                        template:'<div class="hidden-overlay" (click)="closeDropdown()" *ngIf="opened"></div><div class="action-sheet bottom is-active" ngClass="{\'is-active\': active}" *ngIf="opened" [style.left.px]="posLeft" [style.top.px]="posTop"><div (click)="closeDropdown()"><ng-content></ng-content></div></div>',
                        directives: []
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], DropdownComponent);
                return DropdownComponent;
            }());
            exports_1("DropdownComponent", DropdownComponent);
        }
    }
});
