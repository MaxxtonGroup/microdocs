/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {ProjectJsonRepository} from "../repositories/json/project-json.repo";
import {ResponseHelper} from "./responses/response.helper";

/**
 * @controller
 * @baseUrl /api/v1
 */
export class ProjectRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/projects/:title', handler: this.projects};

  /**
   * Get project definition
   * @httpGet /projects/{title}
   * @httpPath title {string} name of the project
   * @httpQuery ?version {string} specify a version
   * @httpQuery ?env {string} environment to find the project definition
   * @httpResponse 200 {Project}
   * @httpResponse 400 the environment doesn't exists
   * @httpResponse 404 Project definitions for the given title/version/env doesn't exists
   */
  public projects(req: express.Request, res: express.Response, next: express.NextFunction, scope:BaseRoute) {
    var handler = ResponseHelper.getHandler(req);
    try {
      var env = scope.getEnv(req, scope);
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }

      var title = req.params.title;
      var version = req.query.version;
      
      var projectRepo = scope.injection.ProjectRepository();

      // load latest version if not specified
      if (version == undefined) {
        var rootNode = projectRepo.getAggregatedProjects(env);
        if (rootNode != null && rootNode.dependencies != undefined) {
          for (var key in rootNode.dependencies) {
            if (key == title) {
              version = rootNode.dependencies[key].version;
              break;
            }
          }
        }
      }

      if (version != undefined) {
        // load project
        var project = projectRepo.getAggregatedProject(env, title, version);

        // return project
        if (project == null) {
          ResponseHelper.getHandler(req).handleNotFound(req, res);
        } else {
          ResponseHelper.getHandler(req).handleProject(req, res, project, env);
        }
      } else {
        ResponseHelper.getHandler(req).handleNotFound(req, res);
      }
    } catch (e) {
      ResponseHelper.getHandler(req).handleInternalServerError(req, res, e);
    }
  }
}