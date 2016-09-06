import {BaseRoute} from "./route";
import * as express from "express";
import {ResponseHelper} from "./responses/response.helper";
import {CheckRoute} from "./check.route";
import {ProjectJsonRepository} from "../repositories/json/project-json.repo";
import {Project, TreeNode} from "microdocs-core-ts/dist/domain";

/**
 * @author Steven Hermans
 */
export class MockAllRoute extends BaseRoute {
  
  mapping = {methods: ['get', 'post', 'put', 'patch'], path: '/mock/**', handler: this.envs, basePath: ''};
  
  public envs(req: express.Request, res: express.Response, next: express.NextFunction) {
    var handler = ResponseHelper.getHandler(req);
    try{
      var env = MockAllRoute.getDefaultEnv();
      if (env == null) {
        handler.handleBadRequest(req, res, "No default env exists");
        return;
      }
  
      var projectRepo = ProjectJsonRepository.bootstrap();
      var projects = projectRepo.getAggregatedProjects(env);
      for(var title in projects.dependencies){
        try {
          var project = projectRepo.getAggregatedProject(env, title, projects.dependencies[title].version);
          if(project && project.paths){
            for(var path in project.paths){
              
            }
          }
        }catch(e:Error){
          console.warn(e.stack);
        }
      }
      
      var segments = req.path.split("/");
      if(segments.length == 0){
        handler.handleNotFound(req, res, 'Try "/mock/{env}/{project}/{version}/{path}');
      }else{
        if(segments[])
        var title = segments[0];
        projectRepo.
      }
    }catch(e){
      handler.handleInternalServerError(req, res, e);
    }
    
    if(segments.length == 0){
      
    }
    
  }
  
  
}