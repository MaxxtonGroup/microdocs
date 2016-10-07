System.register(["@angular/core", "./dropdown.component"], function(exports_1, context_1) {
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
    var core_1, dropdown_component_1;
    var DropdownContainerComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (dropdown_component_1_1) {
                dropdown_component_1 = dropdown_component_1_1;
            }],
        execute: function() {
            DropdownContainerComponent = (function () {
                function DropdownContainerComponent(viewContainerRef) {
                    this.viewContainerRef = viewContainerRef;
                }
                DropdownContainerComponent.prototype.ngAfterContentInit = function () {
                    var _this = this;
                    // contentChildren is set
                    this.contentChildren.forEach(function (dropDownComponent) {
                        dropDownComponent.onOpen.subscribe(function () {
                            console.log(_this.viewContainerRef.element.nativeElement.getBoundingClientRect());
                            var rect = _this.viewContainerRef.element.nativeElement.getBoundingClientRect();
                            dropDownComponent.posTop = rect.top + rect.height / 2;
                            dropDownComponent.posLeft = rect.width / 2 + rect.left;
                            dropDownComponent.setBodyAsRoot();
                        });
                    });
                };
                __decorate([
                    core_1.ContentChildren(dropdown_component_1.DropdownComponent), 
                    __metadata('design:type', core_1.QueryList)
                ], DropdownContainerComponent.prototype, "contentChildren", void 0);
                DropdownContainerComponent = __decorate([
                    core_1.Component({
                        selector: 'dropdown-container',
                        template:'<div class="action-sheet-container"><ng-content></ng-content></div>',
                    }), 
                    __metadata('design:paramtypes', [core_1.ViewContainerRef])
                ], DropdownContainerComponent);
                return DropdownContainerComponent;
            }());
            exports_1("DropdownContainerComponent", DropdownContainerComponent);
        }
    }
});
