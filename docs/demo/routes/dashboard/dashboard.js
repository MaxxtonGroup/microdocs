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
const core_1 = require("@angular/core");
const components_1 = require("@maxxton/components/components");
const dependency_graph_1 = require('../../panels/dependency-graph/dependency-graph');
const project_service_1 = require("../../services/project.service");
const Subject_1 = require("rxjs/Subject");
const router_1 = require("@angular/router");
const welcome_panel_1 = require("../../panels/welcome-panel/welcome.panel");
/**
 * Dashboard route (page that shows the most important information to a user)
 *
 * @author R. Sonke
 */
let DashboardRoute = class DashboardRoute {
    constructor(projectService, router) {
        this.projectService = projectService;
        this.router = router;
        this.empty = false;
        this.nodes = new Subject_1.Subject();
    }
    ngOnInit() {
        this.loadProjects();
        this.router.routerState.queryParams.subscribe(params => {
            this.env = params['env'];
            this.loadProjects();
        });
    }
    loadProjects() {
        console.info('loadProjects: ' + this.env);
        this.projectService.getProjects(this.env).subscribe((data => {
            this.nodes.next(data);
            if (data.dependencies) {
                this.empty = Object.keys(data.dependencies).length == 0;
            }
            else {
                this.empty = true;
            }
        }));
    }
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
exports.DashboardRoute = DashboardRoute;
