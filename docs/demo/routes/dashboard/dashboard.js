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
var core_1 = require("@angular/core");
var components_1 = require("@maxxton/components/components");
var dependency_graph_1 = require('../../panels/dependency-graph/dependency-graph');
var project_service_1 = require("../../services/project.service");
var Subject_1 = require("rxjs/Subject");
var router_1 = require("@angular/router");
var welcome_panel_1 = require("../../panels/welcome-panel/welcome.panel");
/**
 * Dashboard route (page that shows the most important information to a user)
 *
 * @author R. Sonke
 */
var DashboardRoute = (function () {
    function DashboardRoute(projectService, router) {
        this.projectService = projectService;
        this.router = router;
        this.empty = false;
        this.nodes = new Subject_1.Subject();
    }
    DashboardRoute.prototype.ngOnInit = function () {
        var _this = this;
        this.loadProjects();
        this.router.routerState.queryParams.subscribe(function (params) {
            _this.env = params['env'];
            _this.loadProjects();
        });
    };
    DashboardRoute.prototype.loadProjects = function () {
        var _this = this;
        console.info('loadProjects: ' + this.env);
        this.projectService.getProjects(this.env).subscribe((function (data) {
            _this.nodes.next(data);
            if (data.dependencies) {
                _this.empty = Object.keys(data.dependencies).length == 0;
            }
            else {
                _this.empty = true;
            }
        }));
    };
    DashboardRoute = __decorate([
        core_1.Component({
            selector: 'dashboard',
            providers: [],
            template:'<div class="grid-container page-content"><template [ngIf]=empty><welcome-panel></welcome-panel></template><template [ngIf]=!empty><card title="Projects Overview" [sectionClass]="\'card-section content\'" [canHide]=true><dependency-graph [nodes]=nodes [env]=env></dependency-graph></card></template></div>',
            directives: [components_1.COMPONENTS, dependency_graph_1.DependencyGraph, welcome_panel_1.WelcomePanel]
        }), 
        __metadata('design:paramtypes', [project_service_1.ProjectService, router_1.Router])
    ], DashboardRoute);
    return DashboardRoute;
}());
exports.DashboardRoute = DashboardRoute;
