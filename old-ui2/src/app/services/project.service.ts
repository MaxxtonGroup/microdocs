import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Notification } from "rxjs/Notification";
import { Response } from "@angular/http";
import { ProjectTree, Project, ProjectChangeRule, Settings, ProjectMetadata} from "@maxxton/microdocs-core/domain";
import { ProjectClient } from "../clients/project.client";
import { Injectable, Inject } from "@angular/core";
import { MdSnackBar } from "@angular/material";

const TIMEOUT:number = 500;

@Injectable()
export class ProjectService {

  private env:string;
  private projects:Subject<Notification<ProjectMetadata[]>> = new ReplaySubject <Notification<ProjectMetadata[]>>( 1 );
  private project:Subject<Notification<Project>>      = new ReplaySubject <Notification<Project>>( 1 );
  private lastProjectsValue:ProjectMetadata[];
  private lastProjectValue:Project;
  private lastProjectsRefresh:number                  = 0;
  private lastProjectRefresh:number                   = 0;
  private lastProjectTitle:string;
  private lastProjectTag:string;

  constructor(@Inject('ProjectClient') private projectClient:ProjectClient, private snackbar:MdSnackBar) {
    this.projects.subscribe( node => this.lastProjectsValue = node.value );
    this.project.subscribe( project => this.lastProjectValue = project );
  }

  public getProjects( env:string = this.getSelectedEnv() ):Subject<Notification<ProjectMetadata[]>> {
    this.refreshProjects( env );
    return this.projects;
  }

  public refreshProjects( env:string = this.getSelectedEnv(), force:boolean = false ):void {
    if ( this.lastProjectsRefresh + TIMEOUT < new Date().getTime() || force ) {
      this.projectClient.loadProjects( env ).subscribe(
          node => this.projects.next( Notification.createNext( node ) ),
          error => {
            this.handleError( error, "Failed to load project list" );
            this.projects.next( Notification.createError<ProjectMetadata[]>( error ) );
          } );
      this.lastProjectsRefresh = new Date().getTime();
    }
  }

  public getProject( name:string, tag?:string, env:string = this.getSelectedEnv() ):Observable<Notification<Project>> {
    this.refreshProject( name, tag, env );
    return this.project;
  }

  public refreshProject( name:string, tag?:string, env:string = this.getSelectedEnv() ):void {
    var shouldRefresh = true;
    if ( this.lastProjectRefresh + TIMEOUT >= new Date().getTime() && this.lastProjectTitle && this.lastProjectTitle.toLowerCase() === name.toLowerCase() && this.lastProjectTag === tag ) {
      shouldRefresh = false;
    }
    if ( shouldRefresh ) {
      this.projectClient.loadProject( env, name, tag ).subscribe(
          project => this.project.next( Notification.createNext( project ) ),
          error => {
            this.handleError( error, "Failed to load project " + name + ":" + tag );
            this.project.next( Notification.createError( error ) );
          } );
      this.lastProjectRefresh = new Date().getTime();
      this.lastProjectTitle   = name;
      this.lastProjectTag = tag;
    }
  }

  public addProject( project:Project, env:string = this.getSelectedEnv() ):Observable<Project> {
    return this.projectClient.addProject( env, project, project.info.title, project.info.tag );
  }

  public deleteProject( title:string, tag?:string, env:string = this.getSelectedEnv() ):Observable<Response> {
    if(tag){
      this.projectClient.deleteDocument(env, title, tag);
    }else{
      return this.projectClient.deleteProject( env, title );
    }
  }

  public updateProject( title:string, rules:ProjectChangeRule[], tag?:string, env:string = this.getSelectedEnv() ):Observable<Response> {
    if(tag){
      return this.projectClient.updateDocument( env, title, rules, tag );
    }else{
      return this.projectClient.updateProject( env, title, rules );
    }
  }

  public reindex( env:string = this.getSelectedEnv() ):Observable<Response> {
    return this.projectClient.reindex( env );
  }

  public getSettings():Observable<Settings>{
    return this.projectClient.getSettings();
  }

  public setSelectedEnv( env:string ) {
    this.env                 = env;
    this.lastProjectsRefresh = 0;
    this.lastProjectRefresh  = 0;
    this.refreshProjects( env );
  }

  public getSelectedEnv():string {
    return this.env;
  }

  private handleError( error:Response, friendlyMessage:string ):void {
    this.snackbar.open(friendlyMessage, undefined, {duration: 3000});
//    this.snackbarService.addNotification( friendlyMessage, undefined, undefined, 'error_outline', undefined );
    try {
      var body = error.json();
      var e    = body.error;
      var msg  = body.message;
      if ( e ) {
        console.error( e + (msg ? ' (' + msg + ')' : '') );
      }
    } catch ( e ) {/*hide parse error*/
    }
  }

}
