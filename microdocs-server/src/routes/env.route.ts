/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {ResponseHelper} from "./responses/response.helper";
import {ProjectSettingsJsonRepository} from "../repositories/json/project-settings-json.repo";

export class EnvRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/envs', handler: this.projects};

  public projects(req: express.Request, res: express.Response, next: express.NextFunction) {
    var handler = ResponseHelper.getDefaultHandler();
    try {
      var envs = ProjectSettingsJsonRepository.bootstrap().getEnvs();
      handler.response(req, res, 200, envs);
    } catch (e) {
      ResponseHelper.getHandler(req).handleInternalServerError(req, res, e);
    }
  }
}