
import * as express from "express";

import {BaseRoute} from "./route";
import {Problem, ProjectInfo, Project} from "@maxxton/microdocs-core/dist/domain";

/**
 * @controller
 */
export class CheckRoute extends BaseRoute {

  mapping = {methods: ['post'], path: '/check', handler: this.projects};

  /**
   * Check project definitions for problems
   * @httpPost /api/v1/check
   * @httpQuery ?env {string} environment to check the project definition against
   * @httpQuery ?project {string} name of the project if not already defined in the project definitions
   * @httpQuery ?title {string} alias for project
   * @httpBody {Project} project definitions which will be checked
   * @httpResponse 200 {ProblemResponse}
   * @httpResponse 404 {} Body is missing or project title is missing
   */
  public projects(req: express.Request, res: express.Response, next: express.NextFunction, scope: BaseRoute) {
    const handler = scope.getHandler(req);
    try {
      const env = scope.getEnv(req, scope);
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }

      const project = req.body as Project;
      if (project != null && project != undefined) {
        let title = req.query.project;
        if (!title) {
          title = project.info.title;
        }
        if (!title) {
          handler.handleBadRequest(req, res, 'project param is missing');
          return;
        }
        if (project.info == null || project.info == undefined) {
          project.info = new ProjectInfo(undefined, undefined, undefined, undefined);
        }
        project.info = new ProjectInfo(title as string, project.info.group, '9999999999.0.0', ['9999999999.0.0'], project.info.links, project.info.description, project.info.sourceLink);

        const problems: Array<Problem> = scope.injection.AggregationService().checkProject(env, project);
        handler.handleProblems(req, res, problems, env);
      } else {
        handler.handleBadRequest(req, res, 'Body is missing');
      }
    } catch (e) {
      scope.getDefaultHandler().handleInternalServerError(req, res, e);
    }
  }
}
