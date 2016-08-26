/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {Problem, ProjectInfo, Project} from "microdocs-core-ts/dist/domain";
import {AggregationService} from "../services/aggregation.service";
import {ResponseHelper} from "./responses/response.helper";

export class CheckRoute extends BaseRoute {

  mapping = {methods: ['post'], path: '/check', handler: this.projects};

  public projects(req: express.Request, res: express.Response, next: express.NextFunction) {
    var handler = ResponseHelper.getHandler(req);
    try {
      var env = CheckRoute.getEnv(req);
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }

      var project = req.body as Project;
      if (project != null && project != undefined) {
        if (project.info == null || project.info == undefined) {
          project.info = new ProjectInfo(undefined, undefined, undefined, undefined);
        }
        if (project.info.title == null || project.info.title == undefined) {
          if (req.query.project != undefined) {
            project.info.title = req.query.project;
          } else {
            handler.handleBadRequest(req, res, 'project param is missing');
            return;
          }
        }
        project.info.version = '9999999999.0.0';
        project.info.versions = ['9999999999.0.0'];

        var problems: Problem[] = AggregationService.bootstrap().checkProject(env, project);
        handler.handleProblems(req, res, problems, env);
      } else {
        handler.handleBadRequest(req, res, 'Body is missing');
      }
    } catch (e) {
      handler.handleInternalServerError(req, res, e);
    }
  }
}