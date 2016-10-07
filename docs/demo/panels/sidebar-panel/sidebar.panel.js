"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by Reinartz.T on 18-7-2016.
 */
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const components_1 = require("@maxxton/components/components");
const Observable_1 = require("rxjs/Observable");
const domain_1 = require('microdocs-core-ts/dist/domain');
const dashboard_1 = require("../../routes/dashboard/dashboard");
let SidebarComponent = class SidebarComponent {
    constructor() {
        this.user = {};
        this.showFullSideBar = true;
        this.menu = [];
        this.searchQuery = '';
        this.change = new core_1.EventEmitter();
    }
    ngOnInit() {
        this.projects.subscribe(node => {
            this.node = node;
            this.initMenu();
        });
    }
    onEnvVersion(newEnv) {
        this.change.emit(newEnv);
    }
    onSearchQueryChange(query) {
        this.searchQuery = query;
        this.initMenu();
    }
    initMenu() {
        var pathPrefix = "projects/";
        var pathPostfix = '';
        if (this.selectedEnv) {
            pathPostfix += '?env=' + this.selectedEnv;
        }
        var menus = [{
                path: '/dashboard',
                pathMatch: 'full',
                component: dashboard_1.DashboardRoute,
                name: 'Overview',
                icon: 'home'
            }];
        var filteredNodes = this.filterNodes(this.node, this.searchQuery);
        for (var title in filteredNodes.dependencies) {
            var groupName = filteredNodes.dependencies[title].group;
            if (groupName == undefined) {
                groupName = "default";
            }
            // add group if it doesn't exists
            if (menus.filter(group => group.name == groupName).length == 0) {
                menus.push({ name: groupName, icon: 'folder', iconOpen: 'folder_open', inactive: true, children: [], childrenVisible: true });
            }
            // add project
            var problems = filteredNodes.dependencies[title].problems;
            var icon = null;
            var iconColor = 'red';
            if (problems != undefined && problems != null && problems > 0) {
                icon = 'error';
            }
            var groupRoute = menus.filter(group => group.name == groupName)[0];
            groupRoute.children.push({
                path: pathPrefix + groupName + '/' + title,
                name: title,
                postIcon: icon,
                postIconColor: iconColor,
                generateIcon: true
            });
        }
        console.info(menus);
        this.menu = menus;
    }
    filterNodes(node, query) {
        var newNode = new domain_1.TreeNode();
        var keywords = query.split(' ');
        for (var title in node.dependencies) {
            var hit = true;
            if (!query || query.trim().length == 0) {
                hit = true;
            }
            else {
                for (var i = 0; i < keywords.length; i++) {
                    if (title.toLowerCase().indexOf(keywords[i].toLowerCase()) == -1) {
                        hit = false;
                        if (node.dependencies[title]['tags']) {
                            node.dependencies[title]['tags'].forEach(tag => {
                                if (tag.toLowerCase().indexOf(keywords[i].toLowerCase()) != -1) {
                                    hit = true;
                                }
                            });
                        }
                    }
                }
            }
            if (hit) {
                newNode.dependencies[title] = node.dependencies[title];
            }
        }
        return newNode;
    }
};
__decorate([
    core_1.HostBinding('class.big'), 
    __metadata('design:type', Boolean)
], SidebarComponent.prototype, "showFullSideBar", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Observable_1.Observable)
], SidebarComponent.prototype, "projects", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Array)
], SidebarComponent.prototype, "envs", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', String)
], SidebarComponent.prototype, "selectedEnv", void 0);
__decorate([
    core_1.Output('envChange'), 
    __metadata('design:type', Object)
], SidebarComponent.prototype, "change", void 0);
SidebarComponent = __decorate([
    core_1.Component({
        selector: 'sidebar-component',
        template:'<div class="grid-block sidebar vertical"><a class=logo [routerLink]="[\'/\']"><h1>MicroDocs</h1><div class=logo-left></div><div class=logo-right></div></a><div class=env-box><select [ngModel]=selectedEnv (change)=onEnvVersion($event.target.value)><option *ngFor="let env of envs" [value]=env>{{env}}</option></select></div><div class=search-box><i class=icon>search</i> <input type=text placeholder=Search (val)=searchQuery (keyup)=onSearchQueryChange($event.target.value)></div><div class=grid-block><vertical-menu [menu]=menu></vertical-menu></div><a (click)="showFullSideBar = !showFullSideBar" class=change-width><span class=icon [hidden]=!showFullSideBar>keyboard_arrow_left</span> <span class=icon [hidden]=showFullSideBar>keyboard_arrow_right</span></a> <a class=microdocs-link target=_blank [href]="\'http://www.microdocs.io\'">microdocs.io</a></div>',
        directives: [router_1.ROUTER_DIRECTIVES, components_1.COMPONENTS]
    }), 
    __metadata('design:paramtypes', [])
], SidebarComponent);
exports.SidebarComponent = SidebarComponent;
