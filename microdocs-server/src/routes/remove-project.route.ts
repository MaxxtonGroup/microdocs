
import * as express from "express";

import {BaseRoute} from "./route";
import {ProjectRepository} from "../repositories/project.repo";
import {ProjectInfo} from '@maxxton/microdocs-core/domain';
import {ReportRepository} from "../repositories/report.repo";

/**
 * @controller
 */
export class RemoveProjectRoute extends BaseRoute {

  mapping = {methods: ['delete'], path: '/projects/:title', handler: this.deleteProject};

  /**
   * Remove a project or only one version of a project
   * @httpDelete /api/v1/projects/{title}
   * @HttpPath title {string} Name of the project
   * @HttpQuery ?version {string} Specify only one version to be removed
   * @httpQuery ?env {string} environment to publish the project definition
   * @httpResponse 200 Removed
   * @httpResponse 404 Project or version of the project doesn't exists
   */
  public deleteProject(req: express.Request, res: express.Response, next: express.NextFunction, scope:BaseRoute) {
    var handler = scope.getHandler(req);
    try {
      var env = scope.getEnv(req, scope);
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }

      var title = req.params.title;
      var version = req.query.version;

      var reportRepo:ReportRepository = scope.injection.ReportRepository();
      var projectRepo:ProjectRepository = scope.injection.ProjectRepository();
      var projectInfos:ProjectInfo[] = reportRepo.getProjects(env);
      
      // remove whole project or just one version
      if(version && version.trim() !== ''){
        // Find matching reports
        var matches = projectInfos.filter(info => info.title.toLowerCase() === title.toLowerCase() && info.getVersions().indexOf(version) != -1).map(info => {info.version = version; return info;});
        if(matches.length == 0){
          handler.handleNotFound(req, res, "Project " + title + ":" + version + " doesn't exists");
          return;
        }
        
        // Delete reports
        matches.forEach(info => {
          if(!reportRepo.removeProject(env, info)){
            throw new Error("Project " + title + ":" + version + " could not be removed");
          }
        });
        
        // Delete aggregated project
        projectRepo.removeAggregatedProject(env, title, version);
        
      }else{
        // Find matching reports
        var matches = projectInfos.filter(info => info.title.toLowerCase() === title.toLowerCase()).map(info => {info.version = undefined; return info;});
        if(matches.length == 0){
          handler.handleNotFound(req, res, "Project " + title + " doesn't exists");
          return;
        }
  
        // Delete reports
        matches.forEach(info => {
          if(!reportRepo.removeProject(env, info)){
            throw new Error("Project " + title + ":" + version + " could not be removed");
          }
        });
  
        // Delete aggregated project
        projectRepo.removeAggregatedProject(env, title);
      }
  
      var nodes = scope.injection.AggregationService().reindex(env);
      handler.handleProjects(req, res, nodes, env, scope.injection);
    } catch (e) {
      scope.getDefaultHandler().handleInternalServerError(req, res, e);
    }
  }
}