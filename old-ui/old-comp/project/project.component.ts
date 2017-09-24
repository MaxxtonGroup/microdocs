import {Component} from "@angular/core";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {Subject} from "rxjs/Subject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Subscription} from "rxjs/Subscription";

import {Project, Path, Method, Schema, Dependency, ProjectTree, DependencyTypes} from "@maxxton/microdocs-core/domain";
import {SchemaHelper} from "@maxxton/microdocs-core/helpers/schema/schema.helper";
import { ProjectChangeRule } from "@maxxton/microdocs-core/domain/settings/project-change-rule.model";

import {ProjectService} from "../../services/project.service";
import {environment} from '../../../environments/environment'
import { StringUtil } from "../../helpers/string.util";
import { MdDialog } from "@angular/material";
import { ExportDialogComponent } from "../export-dialog/export-dialog.component";


@Component({
  selector: 'project-route',
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.scss']
})
export class ProjectComponent {

  config = environment;

  private projects:ProjectTree;
  private nodes:Subject<ProjectTree> = new ReplaySubject<ProjectTree>(1);

  private title:string;
  private tag:string;
  private tags:string[];
  private project:Project = {};

  private loading:boolean = true;
  private notFound:boolean = false;
  private error:string;

  private subscribtions:Subscription[] = [];
  private projectSubscribtion:Subscription;

  private queryParams:Params;
  private pathParams:Params;

  private color = 'blue-gray';

  private rest = DependencyTypes.REST;
  private database = DependencyTypes.DATABASE;
  private uses = DependencyTypes.USES;
  private includes = DependencyTypes.INCLUDES;

  constructor(private projectService:ProjectService,
              private activatedRoute:ActivatedRoute,
              private router:Router,
              private mdDialog:MdDialog) {

    //load metadata
    this.projectService.getProjects().subscribe(notification => {
      notification.do(projects => {
        this.projects = projects;
        this.updateNodes();
      });
    });
  }

  ngOnInit() {
    this.subscribtions.push(this.activatedRoute.queryParams.subscribe(params => {
      this.loading = true;
      this.notFound = false;
      this.error = undefined;
      this.queryParams = params;
      if (this.queryParams['tag'] && this.pathParams) {
        setTimeout(() => this.init());
      }
    }));
    this.subscribtions.push(this.activatedRoute.params.subscribe(params => {
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
    this.tag = this.queryParams['tag'];
    this.title = this.pathParams['project'];
    this.color = StringUtil.getColorCodeFromString(this.title);
    this.updateNodes();
    this.loadProject(this.title, this.tag);
  }

  loadProject(title:string, tag:string) {
    if (this.projectSubscribtion) {
      this.projectSubscribtion.unsubscribe();
    }
    this.projectSubscribtion = this.projectService.getProject(title, tag).subscribe(notification => {
      notification.do(project => {
        this.project = project;
        this.loading = false;
        this.notFound = false;
        this.error = undefined;
      }, (error) => {
        this.loading = false;
        if(notification.error.status == 404){
          this.notFound = true;
          this.error = "Not Found";
        }else{
          this.notFound = false;
          this.error = "Something went wrong"
        }
      });
    });
  }

  onChangeTag( tag:string) {
    var url = '/projects/' + this.title;
    this.router.navigate([url], {
      queryParams: {
        tag: tag,
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
    return '/projects/' + dependency['_id'];
  }

  getLastDependencyParams(dependency:Dependency):{} {
    return {tag: dependency.latestTag, env: this.projectService.getSelectedEnv()};
  }

  getDependencyParams(dependency:Dependency):{} {
    return {tag: dependency.tag, env: this.projectService.getSelectedEnv()};
  }

  updateNodes() {
    if (this.projects) {
      this.projects.projects.forEach(project => {
        if (project.title === this.title) {
          this.tags = project.tags;
          if(this.tag && this.tags.indexOf(this.tag) == -1){
            this.tags.push(this.tag);
          }
//          this.tags = this.tags.sort();
        }
      });
      this.nodes.next(this.projects);
    }
  }

  toggleDeprecated(){
    this.project.deprecated = !this.project.deprecated;
    let rules = [
        new ProjectChangeRule('deprecated', ProjectChangeRule.TYPE_ALTER, this.project.deprecated, ProjectChangeRule.SCOPE_VERSION)
    ];
    this.projectService.updateProject(this.title, rules, this.tag).subscribe(resp => {
      this.projectService.refreshProject(this.title, this.tag);
    });
  }

  timeEquals(updateTime:string, publishTime:string):boolean{
    return new Date(updateTime).getTime() - new Date(publishTime).getTime() > 1000;
  }

  showExportModal():void{
//    let ref = this.mdDialog.open(ExportDialogComponent);
  }

  showEditModal():void{

  }

  showDeleteModal():void{

  }
}
