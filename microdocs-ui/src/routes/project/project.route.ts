import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, ActivatedRoute, Router, Params} from "@angular/router";

import {COMPONENTS} from "@maxxton/components/dist/components";
import {FILTERS} from "@maxxton/components/dist/filters";
import {Project, Path, Method, Schema} from "microdocs-core-ts/dist/domain";
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";

import {ProjectService} from "../../services/project.service";
import {EndpointPanel} from "../../panels/endpoint-panel/endpoint.panel";
import {ModelPanel} from "../../panels/model-panel/model.panel";
import {SortByHttpMethod} from "../../pipes/sort-by-http-method.pipe";


@Component({
  selector: 'project-route',
  templateUrl: 'project.tpl.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS, EndpointPanel, ModelPanel],
  pipes: [FILTERS, SortByHttpMethod]
})
export class ProjectRoute {

  private querySub:any;
  private pathSub:any;
  private title:string;
  private version:string;
  private versions:string[];
  private project:Project = {};
  private loading:boolean = true;

  private queryParams:Params;
  private pathParams:Params;

  constructor(private projectService:ProjectService,
              private route:ActivatedRoute,
              private router:Router) {
  }

  ngOnInit() {
    this.querySub = this.router.routerState.queryParams.subscribe(params => {
      this.queryParams = params;
      if(this.pathParams != undefined){
        this.init();
      }
    });
    this.pathSub = this.route.params.subscribe(params => {
      this.pathParams = params;
      if(this.queryParams != undefined){
        this.init();
      }
    });
  }

  init() {
    this.version = this.queryParams['version'];
    this.title = this.pathParams['project'];
    //load metadata
    var wait = this.version == undefined;
    this.projectService.getProjects().subscribe(node => {
      if (node.dependencies != undefined) {
        for (var key in node.dependencies) {
          if (key == this.title) {
            this.versions = node.dependencies[key].versions;
            if (wait) {
              this.version = node.dependencies[key].version;
              this.loadProject(this.title, this.version);
            }
            break;
          }
        }
      }
    });
    if (!wait) {
      this.loadProject(this.title, this.version);
    }
  }

  loadProject(title:string, version:string) {
    this.projectService.getProject(title, version).subscribe(project => {
      this.project = project;
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
    this.pathSub.unsubscribe();
  }

  onChangeVersion(version:string) {
    this.router.navigateByUrl('/projects/' + this.project.info.group + "/" + this.title + "?version=" + version);
  }

  getModelSourceLink(sourceLink:string, name:string, schema:Schema) {
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

      sourceLink = SchemaHelper.resolveString(sourceLink, schemaSettings);
    }
    return sourceLink;
  }

  getControllerSourceLink(sourceLink:string, endpoint:Path) {
    if (sourceLink != null && sourceLink != undefined) {
      if (endpoint.controller != undefined) {
        var controller = endpoint.controller;
        var method:Method = endpoint.method;
        if (controller != undefined) {
          var controllerSettings = {};
          if (controller != undefined && controller != null) {
            controllerSettings['class'] = {
              type: controller.type,
              name: controller.name,
              path: controller.name.replace(new RegExp('\\.', 'g'), '/'),
              lineNumber: 0
            };
            if (method != undefined && method != null) {
              controllerSettings['class']['lineNumber'] = method.lineNumber;
            }
          }
          sourceLink = SchemaHelper.resolveString(sourceLink, controllerSettings);
        }
      }
    }
    return sourceLink;
  }

}