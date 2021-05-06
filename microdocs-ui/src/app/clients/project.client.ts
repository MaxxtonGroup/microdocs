import { ProjectTree, Project, Environments, ProjectChangeRule, ProblemResponse } from "@maxxton/microdocs-core/dist/domain";
import { Observable } from "rxjs";

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


  importProject( env:string, project:Project, title:string, group:string, version:string ):Observable<ProblemResponse>;

  deleteProject( env:string, title:string, version?:string ):Observable<any>;

  updateProject( env:string, title:string, rules:ProjectChangeRule[], version?:string ):Observable<any>;

  reindex( env:string ):Observable<any>;


}