import { ProjectTree, Project, Environments, ProjectChangeRule } from "@maxxton/microdocs-core/domain";
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
  getEnvs():Observable<{[key:string]:Environments}>;


  importProject( env:string, project:Project, title:string, group:string, version:string ):Observable<Response>;

  deleteProject( env:string, title:string, version?:string ):Observable<Response>;

  updateProject( env:string, title:string, rules:ProjectChangeRule[], version?:string ):Observable<Response>;

  reindex( env:string ):Observable<Response>;


}