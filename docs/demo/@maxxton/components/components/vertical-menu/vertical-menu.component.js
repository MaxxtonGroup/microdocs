System.register(["@angular/core", "@angular/router", "../../filters/index", "../icon-generator/icon-generator.component"], function(exports_1, context_1) {
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
    var core_1, router_1, index_1, icon_generator_component_1;
    var VerticalMenuComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (icon_generator_component_1_1) {
                icon_generator_component_1 = icon_generator_component_1_1;
            }],
        execute: function() {
            /**
             * A vertical menu based on defined routes
             *
             * @author R. Reinartz (r.reinartz@maxxton.com)
             */
            VerticalMenuComponent = (function () {
                function VerticalMenuComponent(router) {
                    this.router = router;
                }
                VerticalMenuComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    //Fallback on routes if no menus are declared as input
                    if (this.menu == undefined) {
                        //handle navigation events on the router
                        var self = this;
                        this.router.events.subscribe(function (navigationEvent) {
                            _this.menu = self.router.config;
                        });
                    }
                };
                Object.defineProperty(VerticalMenuComponent.prototype, "mainMenu", {
                    get: function () {
                        return this.menu;
                    },
                    enumerable: true,
                    configurable: true
                });
                VerticalMenuComponent.prototype.getRouterLink = function (config) {
                    if (config.path) {
                        return (this.basePath ? this.basePath : '') + "/" + config.path;
                    }
                    return (this.basePath ? this.basePath : null);
                };
                VerticalMenuComponent.prototype.getIcon = function (config) {
                    if (!config.childrenVisible) {
                        return config.icon;
                    }
                    else {
                        return config.iconOpen ? config.iconOpen : config.icon;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], VerticalMenuComponent.prototype, "menu", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], VerticalMenuComponent.prototype, "basePath", void 0);
                VerticalMenuComponent = __decorate([
                    core_1.Component({
                        selector: 'vertical-menu',
                        template:'<section class="block-list"><ul *ngIf="mainMenu"><li *ngFor="let option of mainMenu" [hidden]="option.hidden"><template [ngIf]="option.path | notEmpty"><a [routerLink]="[getRouterLink(option)]" routerLinkActive="active"><span class="icon" *ngIf="!option.generateIcon">{{getIcon(option)}}</span><icon-generator [text]="option.name || option.component.name" *ngIf="option.generateIcon"></icon-generator><span class="name">{{option.name || option.component.name}}</span><template [ngIf]="option.postIcon"><span [class]="\'icon post-icon \' + option.postIconColor">{{option.postIcon}}</span></template></a></template><template [ngIf]="option.path | empty"><a (click)="option.childrenVisible = !option.childrenVisible"><span class="icon" *ngIf="!option.generateIcon">{{getIcon(option)}}</span><icon-generator [text]="option.name || option.component.name" *ngIf="option.generateIcon"></icon-generator><span class="name">{{option.name || option.component.name}}</span></a></template><template [ngIf]="option.children && option.childrenVisible"><vertical-menu [menu]="option.children" [basePath]="getRouterLink(option)"></vertical-menu></template></li></ul></section>',
                        directives: [router_1.ROUTER_DIRECTIVES, VerticalMenuComponent, icon_generator_component_1.IconGenerator],
                        pipes: [index_1.FILTERS]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router])
                ], VerticalMenuComponent);
                return VerticalMenuComponent;
            }());
            exports_1("VerticalMenuComponent", VerticalMenuComponent);
        }
    }
});
