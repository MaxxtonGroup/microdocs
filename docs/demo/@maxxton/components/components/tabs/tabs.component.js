System.register(["@angular/core", "../card/card.component", "./tab.component"], function(exports_1, context_1) {
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
    var core_1, card_component_1, tab_component_1;
    var TabsComponent, TABS_DIRECTIVES;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (card_component_1_1) {
                card_component_1 = card_component_1_1;
            },
            function (tab_component_1_1) {
                tab_component_1 = tab_component_1_1;
            }],
        execute: function() {
            TabsComponent = (function () {
                function TabsComponent(tabComponents) {
                    var _this = this;
                    this.tabComponents = tabComponents;
                    this.tabs = [];
                    this.tabComponents.changes.subscribe(function (tabs) {
                        _this.tabComponents.toArray().forEach(function (tab, index) {
                            _this.addTab(tab);
                        });
                    });
                }
                TabsComponent.prototype.getClass = function () {
                    var className = '';
                    if (typeof this.secondary != 'undefined') {
                        className = className + ' secondary';
                    }
                    else {
                        className = className + ' primary';
                    }
                    if (typeof this.vertical != 'undefined') {
                        className = className + ' grid-block small-2 vertical';
                    }
                    return className;
                };
                TabsComponent.prototype.getContainerClass = function () {
                    var className = '';
                    if (typeof this.vertical != 'undefined') {
                        className = className + ' grid-block horizontal';
                    }
                    return className;
                };
                TabsComponent.prototype.getContentClass = function () {
                    var className = '';
                    if (typeof this.secondary != 'undefined') {
                        className = className + ' secondary';
                    }
                    else {
                        className = className + ' primary';
                    }
                    if (typeof this.vertical == 'string') {
                        return className + ' grid-block small-10';
                    }
                    else {
                        return className;
                    }
                };
                TabsComponent.prototype.selectTab = function (tab) {
                    tab.setActiveState(true);
                    this.tabs.forEach(function (_tab) {
                        if (_tab != tab) {
                            _tab.setActiveState(false);
                        }
                    });
                };
                TabsComponent.prototype.getActiveTab = function () {
                    var activeTab = null;
                    this.tabs.forEach(function (tab) {
                        if (tab.active) {
                            activeTab = tab;
                        }
                    });
                    return activeTab;
                };
                TabsComponent.prototype.addTab = function (tab) {
                    if (this.tabs.length === 0) {
                        tab.setActiveState(true);
                    }
                    this.tabs.push(tab);
                };
                TabsComponent = __decorate([
                    core_1.Component({
                        selector: 'tabs',
                        inputs: ['secondary: secondary', 'vertical: vertical'],
                        template:'<div class="tabs-container {{getContainerClass()}}"><div class="tabs {{getClass()}} header"><div class="tab-item" *ngFor="let tab of tabs" (click)="selectTab(tab)" [ngClass]="{\'is-active\': tab.active}">{{tab.title}}</div></div><div class="{{getContentClass()}} content"><ng-content></ng-content></div></div>',
                        providers: [card_component_1.CardComponent],
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }),
                    __param(0, core_1.Query(tab_component_1.TabComponent)), 
                    __metadata('design:paramtypes', [core_1.QueryList])
                ], TabsComponent);
                return TabsComponent;
            }());
            exports_1("TabsComponent", TabsComponent);
            exports_1("TABS_DIRECTIVES", TABS_DIRECTIVES = [TabsComponent, tab_component_1.TabComponent]);
        }
    }
});
