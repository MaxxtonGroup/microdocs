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
var router_1 = require("@angular/router");
var components_1 = require("@maxxton/components/components");
var filters_1 = require("@maxxton/components/filters");
var dependency_type_model_1 = require("microdocs-core-ts/dist/domain/dependency/dependency-type.model");
var schema_helper_1 = require("microdocs-core-ts/dist/helpers/schema/schema.helper");
var project_service_1 = require("../../services/project.service");
var endpoint_panel_1 = require("../../panels/endpoint-panel/endpoint.panel");
var model_panel_1 = require("../../panels/model-panel/model.panel");
var problem_panel_1 = require("../../panels/problem-panel/problem.panel");
var sort_by_http_method_pipe_1 = require("../../pipes/sort-by-http-method.pipe");
var Subject_1 = require("rxjs/Subject");
var dependency_graph_1 = require("../../panels/dependency-graph/dependency-graph");
var endpoint_group_panel_1 = require("../../panels/endpoint-group-panel/endpoint-group.panel");
var ProjectRoute = (function () {
    function ProjectRoute(projectService, route, router) {
        this.projectService = projectService;
        this.route = route;
        this.router = router;
        this.nodes = new Subject_1.Subject();
        this.project = {};
        this.loading = true;
        this.showModal = false;
        this.color = 'blue-gray';
        this.colorRanges = {
            'pink': ['a', 'b'],
            'red': ['c', 'd'],
            'orange': ['e', 'f'],
            'amber': ['g', 'h'],
            'yellow': ['i', 'j'],
            'lime': ['k', 'l'],
            'green': ['m', 'n'],
            'teal': ['o', 'p'],
            'cyan': ['q', 'r'],
            'light-blue': ['s', 't'],
            'blue': ['u', 'v'],
            'indigo': ['w', 'x'],
            'purple': ['y', 'z']
        };
        this.rest = dependency_type_model_1.REST;
        this.database = dependency_type_model_1.DATABASE;
        this.uses = dependency_type_model_1.USES;
        this.includes = dependency_type_model_1.INCLUDES;
    }
    ProjectRoute.prototype.ngOnInit = function () {
        var _this = this;
        this.querySub = this.router.routerState.queryParams.subscribe(function (params) {
            _this.loading = true;
            _this.queryParams = params;
            if (_this.pathParams != undefined) {
                setTimeout(function () { return _this.init(); });
            }
        });
        this.pathSub = this.route.params.subscribe(function (params) {
            _this.loading = true;
            _this.pathParams = params;
            if (_this.queryParams != undefined) {
                setTimeout(function () { return _this.init(); }, 100);
            }
        });
    };
    ProjectRoute.prototype.init = function () {
        var _this = this;
        this.version = this.queryParams['version'];
        this.env = this.queryParams['env'];
        this.title = this.pathParams['project'];
        this.color = this.getColorByTitle(this.title);
        //load metadata
        this.projectService.getProjects(this.env).subscribe(function (node) {
            if (node.dependencies != undefined) {
                for (var key in node.dependencies) {
                    if (key == _this.title) {
                        _this.versions = node.dependencies[key].versions;
                        if (!_this.version) {
                            _this.version = node.dependencies[key].version;
                        }
                        _this.loadProject(_this.title, _this.version, _this.env);
                        break;
                    }
                }
                // update nodes
                _this.nodes.next(node);
            }
        });
    };
    ProjectRoute.prototype.getColorByTitle = function (title) {
        var selectedColor;
        var first = title.substr(0, 1);
        for (var color in this.colorRanges) {
            this.colorRanges[color].forEach(function (char) {
                if (char == first) {
                    selectedColor = color;
                    return false;
                }
            });
            if (selectedColor) {
                return selectedColor;
            }
        }
        return 'blue-gray';
    };
    ProjectRoute.prototype.loadProject = function (title, version, env) {
        var _this = this;
        this.projectSub = this.projectService.getProject(title, version, env).subscribe(function (project) {
            _this.project = project;
            _this.loading = false;
        });
    };
    ProjectRoute.prototype.ngOnDestroy = function () {
        console.info("destroy");
        if (this.querySub != undefined)
            this.querySub.unsubscribe();
        if (this.pathSub != undefined)
            this.pathSub.unsubscribe();
        if (this.projectSub != undefined)
            this.projectSub.unsubscribe();
        if (this.projectsSub != undefined)
            this.projectsSub.unsubscribe();
    };
    ProjectRoute.prototype.onChangeVersion = function (version) {
        this.router.navigateByUrl('/projects/' + this.project.info.group + "/" + this.title + "?version=" + version);
    };
    ProjectRoute.prototype.getModelSourceLink = function (sourceLink, name, schema) {
        if (sourceLink != null && sourceLink != undefined) {
            var schemaSettings = {
                class: {
                    type: schema.type,
                    simpleName: schema.name,
                    name: name,
                    path: name.replace(new RegExp('\\.', 'g'), '/'),
                    lineNumber: 0
                }
            };
            sourceLink = schema_helper_1.SchemaHelper.resolveString(sourceLink, schemaSettings);
        }
        return sourceLink;
    };
    ProjectRoute.prototype.getDependencyLink = function (dependency) {
        return '/projects/' + (dependency.group != undefined ? dependency.group : 'default') + '/' + dependency['_id'];
    };
    ProjectRoute = __decorate([
        core_1.Component({
            selector: 'project-route',
            template:'<toolbar class=white><toolbar-title><icon-generator [text]=title></icon-generator><span class=title>{{title}}</span></toolbar-title><toolbar-item class=align-left><select [ngModel]=version (change)=onChangeVersion($event.target.value)><option *ngFor="let v of versions" [value]=v>{{v}}</option></select></toolbar-item><toolbar-item class=align-right (click)="showModal = true"><span class=icon>code</span></toolbar-item></toolbar><div class=project-content [class.loading]=loading><div class="grid-container page-content"><card [sectionClass]="\'card-section content\'" title=Info [canFullscreen]=false><template [ngIf]="project.problemCount | notEmpty"><div class=problem-box><span class=icon>error</span> <span class=problem>This project contains {{project.problemCount}} problem{{project.problemCount > 1 ? \'s\' : \'\'}}</span></div></template><div *ngIf="project | notEmpty:\'info.description\'" class=project-desc>{{project.info.description}}</div><div *ngIf="project | notEmpty:\'info.links\'" class=project-links><ul><li *ngFor="let link of project.info.links"><span class=link><span class=icon>keyboard_arrow_right</span> <a [href]=link.href target=_blank>{{link.rel}}</a></span></li></ul></div><dependency-graph class=small [nodes]=nodes [env]=env [projectName]=title></dependency-graph></card><card title=Endpoints [sectionClass]="\'card-section content\'" [canFullscreen]=false *ngIf="project.paths | notEmpty"><div *ngFor="let path of project.paths | objectIterator | sortByKey:\'_id\'"><endpoint-group [endpointGroup]=path></endpoint-group></div></card><card title=Clients [sectionClass]="\'card-section content\'" [canFullscreen]=false *ngIf="project.dependencies | filterByField:\'type\':rest | notEmpty"><div *ngFor="let client of project.dependencies | filterByField:\'type\':rest | objectIterator | sortByKey:\'_id\'"><div class=client-header><span class=link><span class=icon>keyboard_arrow_right</span> <a [routerLink]=getDependencyLink(client)>{{client._id}}</a></span><div class=client-problem *ngIf="client.version !== client.latestVersion"><span class="icon red">error</span> <span class=client-problem-desc *ngIf="client.version | empty">Not compatible</span> <span class=client-problem-desc *ngIf="client.version | notEmpty">Latest compatible version: <a class=link [routerLink]=getDependencyLink(client) [queryParams]="{version: client.version}">{{client.version}}</a></span></div></div><template [ngIf]="client.problems | notEmpty"><problem-panel [problems]=client.problems></problem-panel></template><div *ngFor="let path of client.paths | objectIterator | sortByKey:\'_id\'"><endpoint-group [endpointGroup]=path></endpoint-group></div></div></card><card title=Models [sectionClass]="\'card-section content\'" [canFullscreen]=false *ngIf="project.definitions | filterByField:\'type\':\'object\' | notEmpty"><model-panel [schema]=schema *ngFor="let schema of project.definitions | objectIterator | sortByKey:\'_id\'"></model-panel></card></div></div><modal [showModal]=showModal (stateChanges)="showModal = $event" title=Export><ul><li><a href="/api/v1/projects/{{title}}?export=microdocs&version={{version}}" target=_blank><h6>MicroDocs</h6></a></li><li><a href="/api/v1/projects/{{title}}?export=swagger&version={{version}}" target=_blank><h6>Swagger</h6></a></li><li><a href="/api/v1/projects/{{title}}?export=api-blueprint&version={{version}}" target=_blank><h6>Api Blueprint</h6></a></li><li><a href="/api/v1/projects/{{title}}?export=postman&version={{version}}" target=_blank><h6>Postman</h6></a></li></ul></modal>',
            directives: [router_1.ROUTER_DIRECTIVES, components_1.COMPONENTS, endpoint_group_panel_1.EndpointGroupPanel, endpoint_panel_1.EndpointPanel, model_panel_1.ModelPanel, problem_panel_1.ProblemPanel, dependency_graph_1.DependencyGraph],
            pipes: [filters_1.FILTERS, sort_by_http_method_pipe_1.SortByHttpMethod]
        }), 
        __metadata('design:paramtypes', [project_service_1.ProjectService, router_1.ActivatedRoute, router_1.Router])
    ], ProjectRoute);
    return ProjectRoute;
}());
exports.ProjectRoute = ProjectRoute;
