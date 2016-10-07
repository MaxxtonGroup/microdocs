System.register(["@angular/core", "@angular/router", "../../filters/string.pipe"], function(exports_1, context_1) {
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
    var core_1, router_1, string_pipe_1;
    var FancyListItemComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (string_pipe_1_1) {
                string_pipe_1 = string_pipe_1_1;
            }],
        execute: function() {
            FancyListItemComponent = (function () {
                function FancyListItemComponent(elem) {
                    this.elem = elem;
                    this.status = '0';
                    this.canFocus = false;
                    this.onFocus = new core_1.EventEmitter();
                    this.hasFocus = false;
                    this.hasIcon = function () {
                        return (this.icon !== undefined && this.icon.length > 0);
                    };
                    this.hasMeta = function () {
                        return (this.meta !== undefined && this.meta.length > 0);
                    };
                }
                FancyListItemComponent.prototype.setFocus = function () {
                    if (this.canFocus) {
                        this.hasFocus = !this.hasFocus;
                    }
                    if (this.hasFocus) {
                        this.elem.nativeElement.classList.add('focus');
                    }
                    else {
                        this.elem.nativeElement.classList.remove('focus');
                    }
                    this.onFocus.emit(this.hasFocus);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FancyListItemComponent.prototype, "title", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FancyListItemComponent.prototype, "smallTitle", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FancyListItemComponent.prototype, "icon", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FancyListItemComponent.prototype, "meta", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], FancyListItemComponent.prototype, "content", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], FancyListItemComponent.prototype, "status", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], FancyListItemComponent.prototype, "canFocus", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], FancyListItemComponent.prototype, "link", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], FancyListItemComponent.prototype, "onFocus", void 0);
                FancyListItemComponent = __decorate([
                    core_1.Component({
                        selector: 'fancy-list-item, [fancy-list-item]',
                        template:'<li class="list-item fancy-list status-{{status}}" (click)="setFocus()"><a *ngIf="link" [routerLink]="[link[0], link[1]]"><div class="icon" [hidden]="!hasIcon()" [ngStyle]="{\'background-image\': \'url(\' + icon + \')\' | stringFilter: \'/\':\'\'}">{{icon | stringFilter: \'\': \'/\'}}</div><span class="title">{{title}} <small *ngIf="smallTitle">{{smallTitle}}</small></span> <span class="meta" [hidden]="!hasMeta()">{{meta}}</span> <span class="content">{{content}}</span></a><template [ngIf]="!link"><div class="icon" [hidden]="!hasIcon()" [ngStyle]="{\'background-image\': \'url(\' + icon + \')\' | stringFilter: \'/\':\'\'}">{{icon | stringFilter: \'\': \'/\'}}</div><span class="title">{{title}} <small *ngIf="smallTitle">{{smallTitle}}</small></span> <span class="meta" [hidden]="!hasMeta()">{{meta}}</span> <span class="content">{{content}}</span></template></li><template [ngIf]="hasFocus"><ng-content></ng-content></template>',
                        directives: [router_1.ROUTER_DIRECTIVES],
                        pipes: [string_pipe_1.StringFilterPipe]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], FancyListItemComponent);
                return FancyListItemComponent;
            }());
            exports_1("FancyListItemComponent", FancyListItemComponent);
        }
    }
});
