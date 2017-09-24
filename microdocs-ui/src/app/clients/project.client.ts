import { ProjectTree, Project, ProjectChangeRule, ProblemReport, Settings, ProjectMetadata } from "@maxxton/microdocs-core/domain";
import { Observable } from "rxjs/Observable";
import { Response } from "@angular/http";

/**
 * @author Steven Hermans
 */
export interface ProjectClient {

  /**
   * Loads all projects
   */
  loadProjects( env:string ):Observable<ProjectMetadata[]>;

  /**
   * Loads projectTree
   */
  loadTree( env:string ):Observable<ProjectTree>;

  /**
   * Load project
   */
  loadProject( env:string, title:string, tag?:string ):Observable<Project>;

  getSettings():Observable<Settings>;


  addProject( env:string, project:Project, title:string, tag:string ):Observable<Project>;

  deleteProject( env:string, title:string ):Observable<Response>;

  deleteDocument( env:string, title:string, tag:string ):Observable<Response>;

  updateProject( env:string, title:string, rules:ProjectChangeRule[] ):Observable<Response>;

  updateDocument( env:string, title:string, rules:ProjectChangeRule[], tag:string ):Observable<Response>;

  reindex( env:string ):Observable<Response>;

  check( env:string, project:Project ):Observable<ProblemReport>;


}
