System.register(["@angular/core", "@angular/router"], function(exports_1, context_1) {
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
    var core_1, router_1;
    var BreadcrumbsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            BreadcrumbsComponent = (function () {
                function BreadcrumbsComponent(router, r) {
                    var _this = this;
                    this.router = router;
                    router.events.subscribe(function (a) {
                        if (router.parseUrl(router.url).root.hasChildren()) {
                            _this.breadcrumbs = router.parseUrl(router.url).root.children['PRIMARY_OUTLET'].pathsWithParams;
                        }
                    });
                }
                BreadcrumbsComponent = __decorate([
                    core_1.Component({
                        selector: 'breadcrumbs',
                        template:'<span *ngFor="let route of breadcrumbs" class="breadcrumb" [ngClass]="{\'active\': route.active}">{{route.path}}</span>',
                    }),
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [router_1.Router, router_1.ActivatedRoute])
                ], BreadcrumbsComponent);
                return BreadcrumbsComponent;
            }());
            exports_1("BreadcrumbsComponent", BreadcrumbsComponent);
        }
    }
});
