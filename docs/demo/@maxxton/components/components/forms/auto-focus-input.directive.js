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
    var AutoFocusInputDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AutoFocusInputDirective = (function () {
                function AutoFocusInputDirective(elem, zone, renderer) {
                    this.elem = elem;
                    this.zone = zone;
                    this.renderer = renderer;
                    this.autoFocusInput = true;
                    this.firstTime = true;
                }
                AutoFocusInputDirective.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    var _self = this;
                    this.zone.runOutsideAngular(function () {
                        if (_this.firstTime && _this.autoFocusInput) {
                            _this.renderer.invokeElementMethod(_this.elem.nativeElement, "focus", null);
                            _self.firstTime = false;
                        }
                    });
                };
                __decorate([
                    core_1.Input('auto-focus-input'), 
                    __metadata('design:type', Boolean)
                ], AutoFocusInputDirective.prototype, "autoFocusInput", void 0);
                AutoFocusInputDirective = __decorate([
                    core_1.Directive({
                        selector: 'input[auto-focus-input]',
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.NgZone, core_1.Renderer])
                ], AutoFocusInputDirective);
                return AutoFocusInputDirective;
            }());
            exports_1("AutoFocusInputDirective", AutoFocusInputDirective);
        }
    }
});
