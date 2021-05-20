import {Project, ProjectInfo} from "@maxxton/microdocs-core/dist/domain";

/**
 * @author Steven Hermans
 */
export interface ReportRepository {
  
  /**
   * Scan report folder for all projects
   * @param env for which env to scan
   */
  getProjects(env:string):ProjectInfo[];
  
  /**
   * Load a report for a specific project version
   * @param env for which env
   * @param projectInfo group/title/version info
   */
  getProject(env:string, projectInfo:ProjectInfo):Project;
  
  /**
   * Save a new report
   * @param env for which env
   * @param project project report
   */
  storeProject(env:string, project:Project):void;
  
  /**
   * Remove report
   * @param env for which env
   * @param info group/title/version info
   * @return false if the report file doesn't exists otherwise true
   */
  removeProject(env:string, info:ProjectInfo):boolean;
  
}