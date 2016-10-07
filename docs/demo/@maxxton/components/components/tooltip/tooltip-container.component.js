System.register(["@angular/core", "@angular/common"], function(exports_1, context_1) {
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
    var core_1, common_1;
    var TooltipContainerComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            TooltipContainerComponent = (function () {
                function TooltipContainerComponent() {
                }
                TooltipContainerComponent.prototype.setOptions = function (options) {
                    this.content = options.content;
                    this.hostView = options.hostView;
                    var element = this.hostView.element.nativeElement;
                    this.top = element.offsetTop + element.offsetHeight + 4;
                    this.left = element.offsetLeft + (element.offsetWidth / 2);
                };
                TooltipContainerComponent = __decorate([
                    core_1.Component({
                        selector: 'tooltip-container',
                        directives: [common_1.NgClass, common_1.NgStyle],
                        template:'<div class="tooltip animated fadeIn" role="tooltip" [style.top.px]="top" [style.left.px]="left">{{content}}</div>',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [])
                ], TooltipContainerComponent);
                return TooltipContainerComponent;
            }());
            exports_1("TooltipContainerComponent", TooltipContainerComponent);
        }
    }
});
