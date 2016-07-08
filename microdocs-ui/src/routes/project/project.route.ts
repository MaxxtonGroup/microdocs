import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, ActivatedRoute, Router} from "@angular/router";

import {COMPONENTS, ModalComponent} from "angular-frontend-mxt/dist/components";
import {Project} from "microdocs-core-ts/dist/domain";

import {ProjectService} from "../../services/project.service";
import {NotEmptyPipe} from "../../filters/not-empty.pipe";
import {ObjectIteratorPipe} from "../../filters/object-iterator.pipe";
import {EndpointPanel} from "../../panels/endpoint/endpoint.panel";


@Component({
  selector: 'project-route',
  templateUrl: 'project.tpl.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS, EndpointPanel],
  pipes: [NotEmptyPipe, ObjectIteratorPipe]
})
export class ProjectRoute {

  private sub:any;
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
    this.sub = this.route.params.subscribe(params => {
      this.title = params['project'];
      this.version = params['version'];

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
    });
  }

  loadProject(title:string, version:string) {
    this.sub = this.projectService.getProject(title, version).subscribe(project => {
      this.project = project;
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}