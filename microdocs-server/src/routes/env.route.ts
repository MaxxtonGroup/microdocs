
import * as express from "express";

import {BaseRoute} from "./route";

/**
 * @controller
 */
export class EnvRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/envs', handler: this.projects};

  /**
   * Get all the environments
   * @httpGet /api/v1/envs
   * @httpResponse 200 {{[name: string]: Environments}[]}
   */
  public projects(req: express.Request, res: express.Response, next: express.NextFunction, scope: BaseRoute) {
    const handler = scope.getDefaultHandler();
    try {
      const envs = scope.injection.ProjectSettingsRepository().getSettings().envs;
      for (const env in envs) {
        delete envs[env].postmanApiKey;
      }
      handler.response(req, res, 200, envs);
    } catch (e) {
      scope.getDefaultHandler().handleInternalServerError(req, res, e);
    }
  }
}
