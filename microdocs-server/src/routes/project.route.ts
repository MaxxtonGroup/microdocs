/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {ProjectJsonRepository} from "../repositories/json/project-json.repo";
import {ProjectRepository} from "../repositories/project.repo";
import {ResponseHelper} from "./responses/response.helper";

export class ProjectRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/projects/:title', handler: this.projects};

  public projects(req:express.Request, res:express.Response, next:express.NextFunction) {
    var handler = ResponseHelper.getHandler(req);
    if(handler == null){
      ResponseHelper.getDefaultHandler().handleNotAcceptable(req, res);
    }else {
      try {
        var title = req.params.title;
        var version = req.query.version;


        // load latest version if not specified
        if (version == undefined) {
          var rootNode = ProjectJsonRepository.bootstrap().getAggregatedProjects();
          if(rootNode != null && rootNode.dependencies != undefined){
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
          var project = ProjectJsonRepository.bootstrap().getAggregatedProject(title, version);

          // return project
          if (project == null) {
            ResponseHelper.getHandler(req).handleNotFound(req, res);
          } else {
            ResponseHelper.getHandler(req).handleProject(req, res, project);
          }
        } else {
          ResponseHelper.getHandler(req).handleNotFound(req, res);
        }
      } catch (e) {
        ResponseHelper.getHandler(req).handleInternalServerError(req, res, e);
      }
    }
  }
}