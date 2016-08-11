/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {ProjectJsonRepository} from "../repositories/json/project-json.repo";
import {ResponseHelper} from "./responses/response.helper";
import {TreeNode} from 'microdocs-core-ts/dist/domain';

export class ProjectsRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/projects', handler: this.projects};

  public projects(req: express.Request, res: express.Response, next: express.NextFunction) {
    var handler = ResponseHelper.getHandler(req);
    if(handler == null){
      ResponseHelper.getDefaultHandler().handleNotAcceptable(req, res);
    }else {
      try {
        var projects = ProjectJsonRepository.bootstrap().getAggregatedProjects();
        if(projects == null){
          projects = new TreeNode();
        }

        ResponseHelper.getHandler(req).handleProjects(req, res, projects);
      } catch (e) {
        ResponseHelper.getHandler(req).handleInternalServerError(req, res, e);
      }
    }
  }
}