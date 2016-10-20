System.register(["@angular/core", "../../services/modal.service"], function(exports_1, context_1) {
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
    var core_1, modal_service_1;
    var ModalComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (modal_service_1_1) {
                modal_service_1 = modal_service_1_1;
            }],
        execute: function() {
            ModalComponent = (function () {
                function ModalComponent(modalService, cd) {
                    this.cd = cd;
                    this.size = 'medium';
                    // output state changes of the modal (true:show/false:hide)
                    this.stateChanges = new core_1.EventEmitter();
                    this.modalService = modalService;
                }
                Object.defineProperty(ModalComponent.prototype, "showModal", {
                    set: function (show) {
                        if (show) {
                            this.show();
                        }
                        else {
                            this.hide();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ModalComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.animateIn = false;
                    this.id = this.generateUUID();
                    document.addEventListener('keydown', function (evt) {
                        //check if escape key is pressed
                        if (evt.keyCode == 27 && _this._active) {
                            _this.hide();
                        }
                    });
                };
                ModalComponent.prototype.ngOnDestroy = function () {
                    this.hide();
                };
                ModalComponent.prototype.generateUUID = function () {
                    var d = new Date().getTime();
                    var uuid = 'MODAL-xxxx-5xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = (d + Math.random() * 16) % 16 | 0;
                        d = Math.floor(d / 16);
                        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                    });
                    return uuid.toUpperCase();
                };
                ModalComponent.prototype.hide = function () {
                    var _this = this;
                    this.animateIn = false;
                    this.modalService.unSetModal(this);
                    document.body.classList.remove('modal-is-open');
                    window.setTimeout(function () {
                        _this._active = false;
                        _this.setCssClasses();
                    }, 300);
                    this.setCssClasses();
                    this.stateChanges.emit(false);
                };
                ModalComponent.prototype.show = function () {
                    //check if there is no active modal
                    if (this.modalService.getCurrentActiveModal() == null) {
                        document.body.classList.add('modal-is-open');
                        this.modalService.setModal(this);
                        this._active = true;
                        this.animateIn = true;
                    }
                    else {
                        //else hide the modal and try again
                        this.modalService.getCurrentActiveModal().hide();
                        this.show();
                    }
                    this.stateChanges.emit(true);
                    this.setCssClasses();
                };
                ModalComponent.prototype.setCssClasses = function () {
                    this.setOverlayClass();
                    this.setModalClass();
                    this.cd.markForCheck();
                };
                ModalComponent.prototype.setOverlayClass = function () {
                    this._overlayClass = { 'is-active': this._active, "fadeIn": this.animateIn, "fadeOut": !this.animateIn };
                };
                ModalComponent.prototype.setModalClass = function () {
                    this._modalClass = { 'fadeInDown': this.animateIn };
                };
                Object.defineProperty(ModalComponent.prototype, "overlayClass", {
                    get: function () {
                        return this._overlayClass;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ModalComponent.prototype, "modalClass", {
                    get: function () {
                        return this._modalClass;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ModalComponent.prototype, "active", {
                    get: function () {
                        return this._active;
                    },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ModalComponent.prototype, "title", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ModalComponent.prototype, "size", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean), 
                    __metadata('design:paramtypes', [Boolean])
                ], ModalComponent.prototype, "showModal", null);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ModalComponent.prototype, "stateChanges", void 0);
                ModalComponent = __decorate([
                    core_1.Component({
                        selector: 'modal',
                        directives: [],
                        template:'<div class="modal-overlay animated" (click)="hide()" [ngClass]="overlayClass"><aside #dialog class="card modal animated {{size}}" [ngClass]="modalClass" (click)="$event.stopPropagation();"><div class="header"><h6>{{title}} <a (click)="hide()" class="close-button ng-scope">×</a></h6></div><div class="content card-section"><ng-content></ng-content></div></aside></div>',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [modal_service_1.ModalService, core_1.ChangeDetectorRef])
                ], ModalComponent);
                return ModalComponent;
            }());
            exports_1("ModalComponent", ModalComponent);
        }
    }
});
