/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {Problem, ProjectInfo, Project} from "@maxxton/microdocs-core/domain";

/**
 * @controller
 * @baseUrl /api/v1
 */
export class CheckRoute extends BaseRoute {

  mapping = {methods: ['post'], path: '/check', handler: this.projects};

  /**
   * Check project definitions for problems
   * @httpPost /check
   * @httpQuery ?env {string} environment to check the project definition against
   * @httpQuery ?project {string} name of the project if not already defined in the project definitions
   * @httpQuery ?title {string} alias for project
   * @httpBody {Project} project definitions which will be checked
   * @httpResponse 200 {ProblemResponse}
   * @httpResponse 404 {} Body is missing or project title is missing
   */
  public projects(req: express.Request, res: express.Response, next: express.NextFunction, scope:BaseRoute) {
    var handler = scope.getHandler(req);
    try {
      var env = scope.getEnv(req, scope);
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
        project.info.setVersions(['9999999999.0.0']);

        var problems: Problem[] = scope.injection.AggregationService().checkProject(env, project);
        handler.handleProblems(req, res, problems, env);
      } else {
        handler.handleBadRequest(req, res, 'Body is missing');
      }
    } catch (e) {
      scope.getDefaultHandler().handleInternalServerError(req, res, e);
    }
  }
}