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
    var StepComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * step component used to create a stepper component
             * see stepper component for usage
             */
            StepComponent = (function () {
                function StepComponent(_viewContainer) {
                    this._viewContainer = _viewContainer;
                    this.valid = true;
                    this.loading = false;
                    this.loadingChange = new core_1.EventEmitter();
                    this.activate = new core_1.EventEmitter();
                    this.deActivate = new core_1.EventEmitter();
                    this._active = false;
                }
                Object.defineProperty(StepComponent.prototype, "active", {
                    get: function () {
                        return this._active;
                    },
                    enumerable: true,
                    configurable: true
                });
                StepComponent.prototype.ngOnChanges = function (changes) {
                    if (changes['loading'])
                        this.loadingChange.emit(this.loading);
                };
                StepComponent.prototype.setActiveState = function (value) {
                    this._viewContainer.element.nativeElement.style.display = value ? 'block' : 'none';
                    //check if tab has been changed
                    if (value == true && value != this._active) {
                        this.activate.emit(this);
                        this.loadingChange.emit(this.loading);
                    }
                    else if (value == false && value != this._active) {
                        this.deActivate.emit(this);
                    }
                    this._active = value;
                };
                StepComponent.prototype.ngAfterContentInit = function () {
                    this._viewContainer.element.nativeElement.style.display = this.active ? 'block' : 'none';
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], StepComponent.prototype, "title", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], StepComponent.prototype, "valid", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], StepComponent.prototype, "loading", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], StepComponent.prototype, "loadingChange", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], StepComponent.prototype, "activate", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], StepComponent.prototype, "deActivate", void 0);
                StepComponent = __decorate([
                    core_1.Component({
                        selector: 'step',
                        template: "<ng-content></ng-content>"
                    }), 
                    __metadata('design:paramtypes', [core_1.ViewContainerRef])
                ], StepComponent);
                return StepComponent;
            }());
            exports_1("StepComponent", StepComponent);
        }
    }
});
