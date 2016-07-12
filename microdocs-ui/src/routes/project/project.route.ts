import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, ActivatedRoute, Router, Params} from "@angular/router";

import {COMPONENTS} from "angular-frontend-mxt/dist/components";
import {FILTERS} from "angular-frontend-mxt/dist/filters";
import {Project} from "microdocs-core-ts/dist/domain";

import {ProjectService} from "../../services/project.service";
import {EndpointPanel} from "../../panels/endpoint/endpoint.panel";
import {Observable} from "rxjs/Rx";


@Component({
  selector: 'project-route',
  templateUrl: 'project.tpl.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS, EndpointPanel],
  pipes: [FILTERS]
})
export class ProjectRoute {

  private querySub:any;
  private pathSub:any;
  private title:string;
  private version:string;
  private versions:string[];
  private project:Project = {};
  private loading:boolean = true;

  constructor(private projectService:ProjectService,
              private route:ActivatedRoute,
              private router:Router) {
  }

  ngOnInit() {
    this.querySub = this.router.routerState.queryParams.subscribe(params => {
      this.version = params['version'];
      if(typeof this.version == 'undefined'){
        this.version = null;
      }
      if(typeof this.title != 'undefined'){
        this.init();
      }
    });
    this.pathSub = this.route.params.subscribe(params => {
      this.title = params['project'];
      if(typeof this.version != 'undefined'){
        this.init();
      }
    });
  }

  init(){
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

  onChangeVersion(version:string){
    this.router.navigateByUrl('/projects/' + this.project.info.group + "/" + this.title + "?version=" + version);
  }

}