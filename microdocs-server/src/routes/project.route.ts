/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {ProjectJsonRepository} from "../repositories/json/project-json.repo";
import {ProjectRepository} from "../repositories/project.repo";
import {ResponseHelper} from "./responses/response.helper";

export class ProjectRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/projects/:title', handler: this.project};

  public project(req: express.Request, res: express.Response, next: express.NextFunction) {
    var handler = ResponseHelper.getHandler(req);
    try {
      var env = ProjectRoute.getEnv(req);
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }

      var title = req.params.title;
      var version = req.query.version;


      // load latest version if not specified
      if (version == undefined) {
        var rootNode = ProjectJsonRepository.bootstrap().getAggregatedProjects(env);
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
        var project = ProjectJsonRepository.bootstrap().getAggregatedProject(env, title, version);

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