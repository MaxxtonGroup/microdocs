import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, ActivatedRoute, Router, Params} from "@angular/router";

import {COMPONENTS} from "@maxxton/components/components";
import {FILTERS} from "@maxxton/components/filters";
import {Project, Path, Method, Schema, Dependency, TreeNode} from "@maxxton/microdocs-core-ts/dist/domain";
import {REST, DATABASE, USES, INCLUDES} from "@maxxton/microdocs-core-ts/dist/domain/dependency/dependency-type.model";
import {SchemaHelper} from "@maxxton/microdocs-core-ts/dist/helpers/schema/schema.helper";

import {ProjectService} from "../../services/project.service";
import {EndpointPanel} from "../../panels/endpoint-panel/endpoint.panel";
import {ModelPanel} from "../../panels/model-panel/model.panel";
import {ProblemPanel} from "../../panels/problem-panel/problem.panel";
import {SortByHttpMethod} from "../../pipes/sort-by-http-method.pipe"
import {DependencyGraph} from "../../panels/dependency-graph/dependency-graph";
import {EndpointGroupPanel} from "../../panels/endpoint-group-panel/endpoint-group.panel";
import {ExportPanel} from "../../panels/export-panel/export.panel";
import {DeletePanel} from "../../panels/delete-panel/delete.panel";
import {EditPanel} from "../../panels/edit-panel/edit.panel";
import {Subject} from "rxjs/Subject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Subscription} from "rxjs/Subscription";


@Component({
  selector: 'project-route',
  templateUrl: 'project.route.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS, EndpointGroupPanel, EndpointPanel, ModelPanel, ProblemPanel, DependencyGraph, ExportPanel, DeletePanel, EditPanel],
  pipes: [FILTERS, SortByHttpMethod]
})
export class ProjectRoute {
  
  private projects:TreeNode;
  private nodes:Subject<TreeNode> = new ReplaySubject<TreeNode>(1);
  
  private title:string;
  private version:string;
  private versions:string[];
  private project:Project = {};
  
  private loading:boolean = true;
  private notFound:boolean = false;
  private error:string;
  
  private showExportModal:boolean = false;
  private showDeleteModal:boolean = false;
  private showEditModal:boolean = false;
  private subscribtions:Subscription[] = [];
  private projectSubscribtion:Subscription;
  
  private queryParams:Params;
  private pathParams:Params;
  
  private color = 'blue-gray';
  private colorRanges = {
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
  
  private rest = REST;
  private database = DATABASE;
  private uses = USES;
  private includes = INCLUDES;
  
  constructor(private projectService:ProjectService,
              private route:ActivatedRoute,
              private router:Router) {
    
    //load metadata
    this.projectService.getProjects().subscribe(notification => {
      notification.do(projects => {
        this.projects = projects;
        this.updateNodes();
      });
    });
  }
  
  ngOnInit() {
    this.subscribtions.push(this.router.routerState.queryParams.subscribe(params => {
      this.loading = true;
      this.notFound = false;
      this.error = undefined;
      this.queryParams = params;
      if (this.queryParams['version'] && this.pathParams) {
        setTimeout(() => this.init());
      }
    }));
    this.subscribtions.push(this.route.params.subscribe(params => {
      this.loading = true;
      this.notFound = false;
      this.error = undefined;
      this.pathParams = params;
      if (this.queryParams != undefined) {
        setTimeout(() => this.init(), 100);
      }
    }));
  }
  
  ngOnDestroy() {
    this.subscribtions.forEach(subscribtion => subscribtion.unsubscribe());
    this.subscribtions = [];
  }
  
  init() {
    this.version = this.queryParams['version'];
    this.title = this.pathParams['project'];
    this.color = this.getColorByTitle(this.title);
    this.updateNodes();
    this.loadProject(this.title, this.version);
  }
  
  getColorByTitle(title:string):string {
    let selectedColor;
    var first = title.substr(0, 1);
    for (var color in this.colorRanges) {
      this.colorRanges[color].forEach(char => {
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
  }
  
  loadProject(title:string, version:string) {
    if (this.projectSubscribtion) {
      this.projectSubscribtion.unsubscribe();
    }
    this.projectSubscribtion = this.projectService.getProject(title, version).subscribe(notification => {
      notification.do(project => {
        this.project = project;
        this.loading = false;
        this.notFound = false;
        this.error = undefined;
      }, (error) => {
        this.loading = false;
        if(notification.exception.status == 404){
          this.notFound = true;
          this.error = "Not Found";
        }else{
          this.notFound = false;
          this.error = "Something went wrong"
        }
      });
    });
  }
  
  onChangeVersion(version:string) {
    var url = '/projects/' + this.title;
    this.router.navigate([url], {
      queryParams: {
        version: version,
        env: this.projectService.getSelectedEnv()
      }
    });
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
  
  getDependencyLink(dependency:Dependency):string {
    return '/projects/' + (dependency.group != undefined ? dependency.group : 'default') + '/' + dependency['_id'];
  }
  
  updateNodes() {
    if (this.projects) {
      if (this.projects.dependencies != undefined) {
        for (var key in this.projects.dependencies) {
          if (key == this.title) {
            this.versions = this.projects.dependencies[key].versions;
            if(this.version && this.versions.indexOf(this.version) == -1){
              this.versions.push(this.version);
            }
            this.versions = this.versions.sort();
            break;
          }
        }
        // update nodes
        this.nodes.next(this.projects);
      }
    }
  }
  
}