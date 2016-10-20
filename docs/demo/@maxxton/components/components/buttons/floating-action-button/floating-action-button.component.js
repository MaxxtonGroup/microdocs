System.register(["@angular/core", "../../../services/snackbar.service", "../../tooltip/tooltip.component"], function(exports_1, context_1) {
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
    var core_1, snackbar_service_1, tooltip_component_1;
    var FloatingActionButtonComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (snackbar_service_1_1) {
                snackbar_service_1 = snackbar_service_1_1;
            },
            function (tooltip_component_1_1) {
                tooltip_component_1 = tooltip_component_1_1;
            }],
        execute: function() {
            FloatingActionButtonComponent = (function () {
                function FloatingActionButtonComponent(snackbarService) {
                    var _this = this;
                    this.snackbarService = snackbarService;
                    this.onActivate = new core_1.EventEmitter();
                    this.isSnackbarOpen = false;
                    this.snackbarNotificationAddedSub = snackbarService.notificationAdded.subscribe(function () {
                        _this.isSnackbarOpen = true;
                    });
                    this.snackbarNotificationRemovedSub = snackbarService.notificationRemoved.subscribe(function () {
                        _this.isSnackbarOpen = false;
                    });
                }
                FloatingActionButtonComponent.prototype.onClick = function (event) {
                    this.onActivate.emit(event);
                };
                FloatingActionButtonComponent.prototype.ngOnDestroy = function () {
                    this.snackbarNotificationAddedSub.unsubscribe();
                    this.snackbarNotificationRemovedSub.unsubscribe();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FloatingActionButtonComponent.prototype, "icon", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FloatingActionButtonComponent.prototype, "color", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FloatingActionButtonComponent.prototype, "title", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], FloatingActionButtonComponent.prototype, "onActivate", void 0);
                FloatingActionButtonComponent = __decorate([
                    core_1.Component({
                        selector: 'fab-button',
                        template:'<div class="hidden-overlay" (click)="showOptions = false" [hidden]="!showOptions"></div><a class="icon animated zoomIn" [style.background.color]="color" [class.snackbar-is-open]="isSnackbarOpen" (click)="onClick($event)" [tooltip]="title">{{icon}}</a>',
                        directives: [tooltip_component_1.TooltipComponent]
                    }), 
                    __metadata('design:paramtypes', [snackbar_service_1.SnackbarService])
                ], FloatingActionButtonComponent);
                return FloatingActionButtonComponent;
            }());
            exports_1("FloatingActionButtonComponent", FloatingActionButtonComponent);
        }
    }
});
