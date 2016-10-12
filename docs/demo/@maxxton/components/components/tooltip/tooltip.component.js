System.register(["@angular/core", "./tooltip-container.component"], function(exports_1, context_1) {
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
    var core_1, tooltip_container_component_1;
    var TooltipComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (tooltip_container_component_1_1) {
                tooltip_container_component_1 = tooltip_container_component_1_1;
            }],
        execute: function() {
            TooltipComponent = (function () {
                function TooltipComponent(viewContainerRef, loader) {
                    this.viewContainerRef = viewContainerRef;
                    this.loader = loader;
                    this.tooltipComponent = null;
                }
                TooltipComponent.prototype.ngOnInit = function () {
                    this.viewContainerRef.element.nativeElement.classList.add('has-tip');
                    //disable title on element
                    if (this.viewContainerRef.element.nativeElement.title.length) {
                        throw new Error('Its not allowed to have a title and a tooltip on the same element' + this.viewContainerRef.element.nativeElement);
                    }
                    this.viewContainerRef.element.nativeElement.title = '';
                    //set tab index
                    if (this.viewContainerRef.element.nativeElement.tabIndex < 0) {
                        this.viewContainerRef.element.nativeElement.tabIndex = 0;
                    }
                };
                TooltipComponent.prototype.ngOnChanges = function (changes) {
                    if (changes['tooltip']) {
                        this.setTooltip(this.tooltip);
                    }
                };
                TooltipComponent.prototype.setTooltip = function (tooltip) {
                    if (!tooltip || tooltip.length < 256) {
                        this.tooltip = tooltip;
                    }
                    else {
                        throw new Error(tooltip + 'This tooltip does not meet the requirements of a tooltip. It should not be null and not hold more then 255 characters');
                    }
                };
                // params: event, target
                TooltipComponent.prototype.show = function () {
                    var _this = this;
                    if (!this.tooltipComponent && this.tooltip && this.tooltip.length > 0) {
                        this.loader.resolveComponent(tooltip_container_component_1.TooltipContainerComponent).then((function (factory) {
                            _this.tooltipComponent = _this.viewContainerRef.createComponent(factory);
                            _this.tooltipComponent.instance.setOptions({ content: _this.tooltip, hostView: _this.viewContainerRef });
                        }));
                    }
                };
                // params event, target
                TooltipComponent.prototype.hide = function () {
                    if (this.tooltipComponent) {
                        this.tooltipComponent.destroy();
                        this.tooltipComponent = null;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], TooltipComponent.prototype, "tooltip", void 0);
                __decorate([
                    core_1.HostListener('focusin', ['$event', '$target']),
                    core_1.HostListener('mouseenter', ['$event', '$target']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', void 0)
                ], TooltipComponent.prototype, "show", null);
                __decorate([
                    core_1.HostListener('focusout', ['$event', '$target']),
                    core_1.HostListener('mouseleave', ['$event', '$target']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', void 0)
                ], TooltipComponent.prototype, "hide", null);
                TooltipComponent = __decorate([
                    core_1.Directive({ selector: '[tooltip]' }), 
                    __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.ComponentResolver])
                ], TooltipComponent);
                return TooltipComponent;
            }());
            exports_1("TooltipComponent", TooltipComponent);
        }
    }
});
