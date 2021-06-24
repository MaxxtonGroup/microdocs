import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { ReplaySubject } from "rxjs";
import { Notification } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { ProjectTree, Project, Environments, ProjectChangeRule, ProblemResponse} from "@maxxton/microdocs-core/domain";
import { ProjectClient } from "../clients/project.client";
import { Injectable, Inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

const TIMEOUT = 500;

@Injectable()
export class ProjectService {

  private env: string;
  private projects: Subject<Notification<ProjectTree>> = new ReplaySubject <Notification<ProjectTree>>( 1 );
  private project: Subject<Notification<Project>>      = new ReplaySubject <Notification<Project>>( 1 );
  private lastProjectsValue: ProjectTree;
  private lastProjectValue: Project;
  private lastProjectsRefresh: number                  = 0;
  private lastProjectRefresh: number                   = 0;
  private lastProjectTitle: string;
  private lastProjectVersion: string;

  constructor(@Inject('ProjectClient') private projectClient: ProjectClient, private snackbar: MatSnackBar) {
    this.projects.subscribe( node => this.lastProjectsValue = node.value );
    this.project.subscribe( project => this.lastProjectValue = project );
  }

  public getProjects( env: string = this.getSelectedEnv() ): Subject<Notification<ProjectTree>> {
    this.refreshProjects( env );
    return this.projects;
  }

  public refreshProjects( env: string = this.getSelectedEnv(), force: boolean = false ): void {
    if ( env && this.lastProjectsRefresh + TIMEOUT < new Date().getTime() || force ) {
      this.projectClient.loadProjects( env ).subscribe(
          node => this.projects.next( Notification.createNext( node ) ),
          error => {
            this.handleError( error, "Failed to load project list" );
            this.projects.next( Notification.createError<ProjectTree>( error ) );
          } );
      this.lastProjectsRefresh = new Date().getTime();
    }
  }

  public getProject( name: string, version?: string, env: string = this.getSelectedEnv() ): Observable<Notification<Project>> {
    this.refreshProject( name, version, env );
    return this.project;
  }

  public refreshProject( name: string, version?: string, env: string = this.getSelectedEnv() ): void {
    let shouldRefresh = true;
    if ( this.lastProjectRefresh + TIMEOUT >= new Date().getTime() && this.lastProjectTitle && this.lastProjectTitle.toLowerCase() === name.toLowerCase() && this.lastProjectVersion === version ) {
      shouldRefresh = false;
    }
    if ( shouldRefresh ) {
      this.projectClient.loadProject( env, name, version ).subscribe(
          project => this.project.next( Notification.createNext( project ) ),
          error => {
            this.handleError( error, "Failed to load project " + name + ":" + version );
            this.project.next( Notification.createError( error ) );
          } );
      this.lastProjectRefresh = new Date().getTime();
      this.lastProjectTitle   = name;
      this.lastProjectVersion = version;
    }
  }

  public importProject( project: Project, title: string, group: string, version: string, env: string = this.getSelectedEnv() ): Observable<ProblemResponse> {
    return this.projectClient.importProject( env, project, title, group, version );
  }

  public deleteProject( title: string, version?: string, env: string = this.getSelectedEnv() ): Observable<HttpResponse<any>> {
    return this.projectClient.deleteProject( env, title, version );
  }

  public updateProject( title: string, rules: Array<ProjectChangeRule>, version?: string, env: string = this.getSelectedEnv() ): Observable<HttpResponse<any>> {
    return this.projectClient.updateProject( env, title, rules, version );
  }

  public reindex( env: string = this.getSelectedEnv() ): Observable<HttpResponse<any>> {
    return this.projectClient.reindex( env );
  }

  public getEnvs(): Observable<{[key: string]: Environments}> {
    return this.projectClient.getEnvs();
  }

  public setSelectedEnv( env: string ) {
    this.env                 = env;
    this.lastProjectsRefresh = 0;
    this.lastProjectRefresh  = 0;
    this.refreshProjects( env );
  }

  public getSelectedEnv(): string {
    return this.env;
  }

  private handleError( error: any, friendlyMessage: string ): void {
    this.snackbar.open(friendlyMessage, undefined, {duration: 3000});
//    this.snackbarService.addNotification( friendlyMessage, undefined, undefined, 'error_outline', undefined );
    try {
      const body = error.json();
      const e    = body.error;
      const msg  = body.message;
      if ( e ) {
        console.error( e + (msg ? ' (' + msg + ')' : '') );
      }
    } catch ( e ) {/*hide parse error*/
    }
  }

}
