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
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var components_1 = require("@maxxton/components/components");
var helpers_1 = require("@maxxton/components/helpers");
var dashboard_1 = require("./../routes/dashboard/dashboard");
var project_service_1 = require("./../services/project.service");
var sidebar_panel_1 = require("../panels/sidebar-panel/sidebar.panel");
var Subject_1 = require("rxjs/Subject");
var App = (function () {
    function App(image, projectService, router) {
        var _this = this;
        this.image = image;
        this.projectService = projectService;
        this.router = router;
        this.showFullSideBar = true;
        this.user = {};
        this.login = {
            error: false,
            status: null
        };
        this.projects = new Subject_1.Subject();
        var result = this.projectService.getProjects();
        if (result)
            this.projectSub = result.subscribe(function (node) { return _this.projects.next(node); });
        projectService.getEnvs().subscribe(function (envs) {
            _this.envs = Object.keys(envs);
            if (projectService.getSelectedEnv() == undefined) {
                for (var key in envs) {
                    if (envs[key].default) {
                        projectService.setSelectedEnv(key);
                        _this.selectedEnv = key;
                        var result = _this.projectService.getProjects();
                        if (result)
                            _this.projectSub = result.subscribe(function (node) { return _this.projects.next(node); });
                        break;
                    }
                }
            }
        });
        this.router.routerState.queryParams.subscribe(function (params) {
            if (params['env'] && _this.projectService.getSelectedEnv() !== params['env']) {
                _this.selectedEnv = params['env'];
                _this.projectService.setSelectedEnv(params['env']);
                if (_this.projectSub && _this.projectSub.unsubscribe) {
                    _this.projectSub.unsubscribe();
                }
                var result = _this.projectService.getProjects();
                if (result)
                    _this.projectSub = result.subscribe(function (node) { return _this.projects.next(node); });
            }
        });
    }
    App.prototype.onEnvVersion = function (newEnv) {
        var _this = this;
        this.projectService.setSelectedEnv(newEnv);
        this.selectedEnv = newEnv;
        if (this.projectSub && this.projectSub.unsubscribe) {
            this.projectSub.unsubscribe();
        }
        var result = this.projectService.getProjects();
        if (result)
            this.projectSub = result.subscribe(function (node) { return _this.projects.next(node); });
        this.router.navigateByUrl('/?env=' + newEnv);
    };
    App = __decorate([
        core_1.Component({
            selector: 'app',
            providers: [],
            directives: [common_1.COMMON_DIRECTIVES, router_1.ROUTER_DIRECTIVES, components_1.COMPONENTS, dashboard_1.DashboardRoute, sidebar_panel_1.SidebarComponent],
            template:'<div class="main-container grid-block horizontal app-content"><sidebar-component [projects]=projects [selectedEnv]=selectedEnv [envs]=envs (envChange)=onEnvVersion($event)></sidebar-component><div class=content id=page-content><div><router-outlet></router-outlet></div></div><snackbar id=snackbar class=snackbar></snackbar></div>',
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [helpers_1.ImageHelperService, project_service_1.ProjectService, router_1.Router])
    ], App);
    return App;
}());
exports.App = App;
