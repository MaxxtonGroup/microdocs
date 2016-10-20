/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {AggregationService} from '../services/aggregation.service';
import {ResponseHelper} from "./responses/response.helper";

/**
 * @controller
 * @baseUrl /api/v1
 */
export class ReindexRoute extends BaseRoute {

  mapping = {methods: ["put"], path: "/reindex", handler: this.reindex};

  /**
   * Start the reindex process
   * @httpPut /reindex
   * @httpEnv ?env {string} environment to publish the project definition
   * @httpResponse 200 {Problem[]}
   */
  public reindex(req: express.Request, res: express.Response, next: express.NextFunction, scope:BaseRoute) {
    var handler = ResponseHelper.getHandler(req);
    try {
      var env = scope.getEnv(req, scope);
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }

      var nodes = scope.injection.AggregationService().reindex(env);
      handler.handleProjects(req, res, nodes, env);
    } catch (e) {
      handler.handleInternalServerError(req, res, e);
    }
  }

}