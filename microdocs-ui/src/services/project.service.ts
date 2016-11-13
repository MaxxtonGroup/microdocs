import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Notification} from "rxjs/Notification";
import {Http, Response} from "@angular/http";
import {RestClient} from "@maxxton/angular2-rest";
import {SnackbarService} from "@maxxton/components/services/snackbar.service";
import {ProjectTree, Project, Environments, ProjectChangeRule} from "@maxxton/microdocs-core/domain";

const TIMEOUT:number = 1000;

export abstract class ProjectService extends RestClient {
  
  private env:string;
  private projects:Subject<Notification<ProjectTree>> = new ReplaySubject <Notification<ProjectTree>>(1);
  private project:Subject<Notification<Project>> = new ReplaySubject <Notification<Project>>(1);
  private lastProjectsValue:ProjectTree;
  private lastProjectValue:Project;
  private lastProjectsRefresh:number = 0;
  private lastProjectRefresh:number = 0;
  private lastProjectTitle:string;
  private lastProjectVersion:string;
  
  constructor(http:Http, private snackbarService:SnackbarService) {
    super(http);
    this.projects.subscribe(node => this.lastProjectsValue = node);
    this.project.subscribe(project => this.lastProjectValue = project);
  }
  
  public getProjects(env:string = this.getSelectedEnv()):Observable<Notification<ProjectTree>> {
    this.refreshProjects(env);
    return this.projects;
  }
  
  public refreshProjects(env:string = this.getSelectedEnv()):void {
    if (this.lastProjectsRefresh + TIMEOUT < new Date().getTime()) {
      this.loadProjects(env).subscribe(
        node => this.projects.next(Notification.createNext(node)),
        error => {
          this.handleError(error, "Failed to load project list");
          this.projects.next(Notification.createError(error));
        });
      this.lastProjectsRefresh = new Date().getTime();
    }
  }
  
  public abstract loadProjects(env:string):Observable<ProjectTree>;
  
  public getProject(name:string, version?:string, env?:string = this.getSelectedEnv()):Observable<Notification<Project>> {
    this.refreshProject(name, version, env);
    return this.project;
  }
  
  public refreshProject(name:string, version?:string, env?:string = this.getSelectedEnv()):void {
    var shouldRefresh = true;
    if (this.lastProjectRefresh + TIMEOUT >= new Date().getTime() && this.lastProjectTitle && this.lastProjectTitle.toLowerCase() === name.toLowerCase() && this.lastProjectVersion === version) {
      shouldRefresh = false;
    }
    if (shouldRefresh) {
      this.loadProject(name, version, env).subscribe(
        project => this.project.next(Notification.createNext(project)),
        error => {
          this.handleError(error, "Failed to load project " + name + ":" + version);
          this.project.next(Notification.createError(error));
        });
      this.lastProjectRefresh = new Date().getTime();
      this.lastProjectTitle = name;
      this.lastProjectVersion = version;
    }
  }
  
  public abstract loadProject(name:string, version?:string, env?:string):Observable<Project>;
  
  public abstract importProject(project:Project, name:string, group:string, version:string, env?:string):Observable<Response>;
  
  public abstract deleteProject(name:string, version?:string, env?:string):Observable<Response>;
  
  public abstract updateProject(name:string, rules:ProjectChangeRule[], version?:string, env?:string):Observable<Response>;

  public abstract reindex(env?:string):Observable<Response>;
  
  public setSelectedEnv(env:string) {
    this.env = env;
    this.lastProjectsRefresh = 0;
    this.lastProjectRefresh = 0;
    this.refreshProjects(env);
  }
  
  public getSelectedEnv():string {
    return this.env;
  }
  
  abstract getEnvs():Observable<{[key:string]:Environments}>;
  
  private handleError(error:Response, friendlyMessage:string):void{
    this.snackbarService.addNotification(friendlyMessage, undefined, undefined, 'error_outline', undefined);
    try{
      var body = error.json();
      var e = body.error;
      var msg = body.message;
      if(e){
        console.error(e + (msg ? ' (' + msg + ')' : ''));
      }
    }catch(e){/*hide parse error*/}
  }
  
}