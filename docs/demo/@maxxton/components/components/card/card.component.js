System.register(["@angular/core", "../../helpers/ease-animation.util", "../../services/hotlink.service", "../../services/preference.service", "rxjs/Rx"], function(exports_1, context_1) {
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
    var core_1, ease_animation_util_1, hotlink_service_1, preference_service_1, Rx_1;
    var CardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ease_animation_util_1_1) {
                ease_animation_util_1 = ease_animation_util_1_1;
            },
            function (hotlink_service_1_1) {
                hotlink_service_1 = hotlink_service_1_1;
            },
            function (preference_service_1_1) {
                preference_service_1 = preference_service_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            CardComponent = (function () {
                function CardComponent(animate, hotlinks, viewContainer, cd, zone, preferenceService) {
                    this.animate = animate;
                    this.hotlinks = hotlinks;
                    this.viewContainer = viewContainer;
                    this.cd = cd;
                    this.zone = zone;
                    this.preferenceService = preferenceService;
                    this.sectionClass = null;
                    this.private = false;
                    this.hasHeader = true;
                    this.canHide = true;
                    this.canFullscreen = true;
                    this.detectPosition = false;
                    this.visible = new core_1.EventEmitter();
                    this.fullscreen = false;
                    this._visible = true;
                }
                CardComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.hotlinks.setHotlinkFromCard(this);
                    this.getHiddenStateFromPreferences();
                    this.loaderValue = 10;
                    this.loading = false;
                    function generateUUID() {
                        var d = new Date().getTime();
                        var uuid = "CARD-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                            var r = (d + Math.random() * 16) % 16 | 0;
                            d = Math.floor(d / 16);
                            return (c === "x" ? r : (r & 0x7 | 0x8)).toString(16);
                        });
                        return uuid.toUpperCase();
                    }
                    this.id = generateUUID();
                    this.zone.runOutsideAngular(function () {
                        _this.scrollSubscription = Rx_1.Observable.fromEvent(window, "scroll").debounceTime(100).subscribe(function () {
                            _this.isCardVisible();
                        });
                    });
                };
                CardComponent.prototype.ngOnDestroy = function () {
                    this.scrollSubscription.unsubscribe();
                    this.hotlinks.removeHotlink(this.id);
                    this.loading = false;
                };
                CardComponent.prototype.ngAfterViewInit = function () {
                    this.getHiddenStateFromPreferences();
                    this.hotlinks.setHotlinkFromCard(this);
                    this.isCardVisible();
                };
                //handle changes
                CardComponent.prototype.ngOnChanges = function (changes) {
                    var _this = this;
                    //handle change on loader
                    if (changes["loading"] !== undefined && changes["loading"].previousValue !== _this.loading) {
                        (_this.loading === true || _this.loading === "true") ? _this.showLoader() : _this.hideLoader();
                    }
                    this.hotlinks.setHotlinkFromCard(this);
                };
                //show loader
                CardComponent.prototype.showLoader = function () {
                    this.loading = true;
                    this.startLoader();
                };
                //hide loader
                CardComponent.prototype.hideLoader = function () {
                    this.loading = false;
                    this.loaderValue = 0;
                };
                CardComponent.prototype.show = function () {
                    this.setHiddenState(false);
                };
                CardComponent.prototype.hide = function () {
                    this.setHiddenState(true);
                };
                CardComponent.prototype.isCardVisible = function () {
                    //if card is set fullscreen it is always visible
                    // if detectPosition is not set true, return visible
                    if (this.fullscreen || !this.detectPosition) {
                        return true;
                    }
                    var _inview = this.elementInViewport(this.outerCardElement.nativeElement);
                    if (_inview !== this._visible) {
                        this._visible = _inview;
                        this.visible.emit(this._visible);
                    }
                    return this._visible;
                };
                CardComponent.prototype.elementInViewport = function (el) {
                    var container = document.body;
                    var top = el.offsetTop;
                    var height = el.offsetHeight;
                    return (top < (container.scrollTop + container.clientHeight) &&
                        (top + height) > container.scrollTop);
                };
                CardComponent.prototype.startLoader = function () {
                    var _this = this;
                    var currentIteration = 0;
                    var totalIterations = 150;
                    _this.loaderValue = 0;
                    function runLoader() {
                        _this.loaderValue = _this.animate.easeOutCubic(currentIteration, 0, 100, totalIterations);
                        currentIteration++;
                        if (currentIteration === totalIterations) {
                            _this.loaderValue = 0;
                            currentIteration = 0;
                        }
                        if (_this.loading) {
                            window.requestAnimationFrame(runLoader);
                        }
                        //hard trigger the change event.
                        _this.cd.markForCheck();
                    }
                    runLoader();
                };
                CardComponent.prototype.getHiddenStateFromPreferences = function () {
                    var _this = this;
                    //get hidden pref from service
                    this.preferenceService.getPreference(this.viewContainer, "card-hidden").subscribe(function (hidden) {
                        _this.hidden = hidden === undefined ? false : hidden;
                    }).unsubscribe();
                };
                CardComponent.prototype.setHiddenState = function (state) {
                    this.hidden = state;
                    this.preferenceService.setPreference(this.viewContainer, "card-hidden", this.hidden);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], CardComponent.prototype, "title", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], CardComponent.prototype, "sectionClass", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], CardComponent.prototype, "subTitle", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CardComponent.prototype, "loading", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], CardComponent.prototype, "private", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], CardComponent.prototype, "hasHeader", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], CardComponent.prototype, "canHide", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], CardComponent.prototype, "canFullscreen", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], CardComponent.prototype, "detectPosition", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], CardComponent.prototype, "visible", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], CardComponent.prototype, "hidden", void 0);
                __decorate([
                    core_1.ViewChild("outerCardElement"), 
                    __metadata('design:type', core_1.ElementRef)
                ], CardComponent.prototype, "outerCardElement", void 0);
                CardComponent = __decorate([
                    core_1.Component({
                        selector: "card",
                        providers: [ease_animation_util_1.EaseAnimationUtil],
                        template:'<div class="card" id="{{id}}" [ngClass]="{fullscreen: fullscreen}" #outerCardElement><div class="card-section header" *ngIf="hasHeader"><span class="title">{{title}}</span> <em class="subtitle">{{subTitle}}</em> <span class="float-right actions"><i *ngFor="let action of actions" class="icon action" (click)="execCardAction($event, action)" [title]="action.name">{{action.icon}}</i><template [ngIf]="canFullscreen"><i [hidden]="fullscreen" class="icon action" (click)="fullscreen = true; show()">fullscreen</i> <i [hidden]="!fullscreen" class="icon action" (click)="fullscreen = false; show()">fullscreen_exit</i></template><template [ngIf]="canHide"><i [hidden]="hidden" class="icon action" (click)="hide(); fullscreen = false;">expand_less</i> <i [hidden]="!hidden" class="icon action" (click)="show()">expand_more</i></template></span></div><progress max="100" [value]="loaderValue" [hidden]="!loading"></progress><div [class]="\'card-section content animated fadeIn \' + sectionClass" [ngClass]="{loading: loading}" *ngIf="!hidden"><ng-content></ng-content></div></div>',
                    }),
                    __param(5, core_1.Inject(preference_service_1.PreferenceService)), 
                    __metadata('design:paramtypes', [ease_animation_util_1.EaseAnimationUtil, hotlink_service_1.HotlinkService, core_1.ViewContainerRef, core_1.ChangeDetectorRef, core_1.NgZone, preference_service_1.PreferenceService])
                ], CardComponent);
                return CardComponent;
            }());
            exports_1("CardComponent", CardComponent);
        }
    }
});
