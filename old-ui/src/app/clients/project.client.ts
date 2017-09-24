import { ProjectTree, Project, ProjectChangeRule, ProblemReport } from "@maxxton/microdocs-core/domain";
import { Observable } from "rxjs/Observable";
import { Response } from "@angular/http";

/**
 * @author Steven Hermans
 */
export interface ProjectClient {

  /**
   * Loads all projects
   */
  loadProjects( env:string ):Observable<ProjectTree>;

  /**
   * Load project
   */
  loadProject( env:string, title:string, version?:string ):Observable<Project>;

  /**
   * Load all the environments
   */
  getEnvs():Observable<any>;


  importProject( env:string, project:Project, title:string, group:string, version:string ):Observable<Project>;

  deleteProject( env:string, title:string ):Observable<Response>;

  deleteDocument( env:string, title:string, version:string ):Observable<Response>;

  updateProject( env:string, title:string, rules:ProjectChangeRule[] ):Observable<Response>;

  updateDocument( env:string, title:string, rules:ProjectChangeRule[], version:string ):Observable<Response>;

  reindex( env:string ):Observable<Response>;

  check( env:string, project:Project ):Observable<ProblemReport>;


}
