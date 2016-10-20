System.register(["@angular/core", "../../helpers/ease-animation.util", "../../services/hotlink.service"], function(exports_1, context_1) {
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
    var core_1, ease_animation_util_1, hotlink_service_1;
    var HotLinksComponent;
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
            }],
        execute: function() {
            HotLinksComponent = (function () {
                function HotLinksComponent(animation, hotlinkService) {
                    this.hotlinkService = hotlinkService;
                    this.animation = animation;
                    this.hotLinks = [];
                }
                HotLinksComponent.prototype.ngAfterContentInit = function () {
                    var _this = this;
                    _this.container = document.getElementById('page-content');
                    document.addEventListener('hotLinkAdded', function () {
                        _this.setHotlinks(_this.hotlinkService.hotlinks);
                    });
                    // _this.container.addEventListener( 'scroll', ( event:Event )=> {
                    //   _this.setActiveHotlink();
                    // } );
                    //check active hotlinks
                    // window.setTimeout( ()=> {
                    //   _this.setActiveHotlink();
                    // }, 250 )
                };
                HotLinksComponent.prototype.gotoMain = function () {
                    // this.router.navigate( [ '/' + this.getBaseRoute().as, {} ] );
                };
                HotLinksComponent.prototype.getBaseRoute = function () {
                    // var _route:_RouteDefinition = null;
                    // this.router.routeConfig.forEach( function ( route:_RouteDefinition ) {
                    //   if ( route.path == "/" ) {
                    //     _route = route;
                    //   }
                    // } );
                    // return _route;
                };
                HotLinksComponent.prototype.setHotlinks = function (hotLinks) {
                    this.hotLinks = hotLinks;
                };
                HotLinksComponent.prototype.getVisibleHotlinks = function () {
                    return this.hotLinks.filter(function (hotlink) {
                        return hotlink.cardObject.private == false;
                    });
                };
                HotLinksComponent.prototype.scrollToCard = function (hotlink) {
                    var scrollOrigin = this.container.scrollTop;
                    var scrollTo = hotlink.offSetTop - 50;
                    var currentIteration = 0;
                    var totalIterations = 20;
                    var _this = this;
                    if (hotlink.active)
                        return;
                    function animateScroll() {
                        //run animation
                        _this.container.scrollTop = _this.animation.easeInOutSine(currentIteration, scrollOrigin, scrollTo - scrollOrigin, totalIterations);
                        //set next iteration
                        currentIteration++;
                        if (currentIteration == totalIterations) {
                            _this.container.scrollTop = scrollTo;
                        }
                        else {
                            //loop trough animation
                            window.requestAnimationFrame(animateScroll);
                        }
                    }
                    animateScroll();
                };
                //method used to set the current active card
                HotLinksComponent.prototype.setActiveHotlink = function () {
                    var containerHeight = this.container.clientHeight;
                    var containerScrollHeight = this.container.scrollHeight;
                    var containerScrollTop = this.container.scrollTop;
                    var _this = this;
                    var hotlinks = _this.getVisibleHotlinks();
                    //check if we are at the bottom of the page
                    if (containerScrollTop + 100 > containerScrollHeight - containerHeight) {
                        hotlinks.forEach(function (link, linkId) {
                            hotlinks[linkId].active = linkId == hotlinks.length - 1;
                        });
                    }
                    else {
                        //in all other cases
                        hotlinks.forEach(function (link, linkId) {
                            //check if it is scrolled into view and set active
                            link.active = link.cardObject.isCardVisible();
                        });
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], HotLinksComponent.prototype, "title", void 0);
                HotLinksComponent = __decorate([
                    core_1.Component({
                        selector: 'hot-links',
                        providers: [ease_animation_util_1.EaseAnimationUtil],
                        template:'<div class="grid-block small-12 shrink primary tab-bar"><div class="logo-spacing"></div><div class="grid-block tab-bar-container"><div class="tabs primary"><div *ngFor="let link of getVisibleHotlinks(); let i = index" class="tab-item" (click)="scrollToCard(link)" title="{{link.title}}" [class.active]="link.active">{{link.title}}</div></div></div></div>',
                    }), 
                    __metadata('design:paramtypes', [ease_animation_util_1.EaseAnimationUtil, hotlink_service_1.HotlinkService])
                ], HotLinksComponent);
                return HotLinksComponent;
            }());
            exports_1("HotLinksComponent", HotLinksComponent);
        }
    }
});
