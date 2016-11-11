/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";

/**
 * @controller
 * @baseUrl /api/v1
 */
export class EnvRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/envs', handler: this.projects};

  /**
   * Get all the environments
   * @httpGet /envs
   * @httpResponse 200 {{[name: string]: Environments}[]}
   */
  public projects(req: express.Request, res: express.Response, next: express.NextFunction, scope:BaseRoute) {
    var handler = scope.getDefaultHandler();
    try {
      var envs = scope.injection.ProjectSettingsRepository().getEnvs();
      handler.response(req, res, 200, envs);
    } catch (e) {
      scope.getDefaultHandler().handleInternalServerError(req, res, e);
    }
  }
}