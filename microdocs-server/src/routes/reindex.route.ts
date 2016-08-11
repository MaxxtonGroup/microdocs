/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {AggregationService} from '../services/aggregation.service';
import {ResponseHelper} from "./responses/response.helper";

/**
 * @author Steven Hermans
 */
export class ReindexRoute extends BaseRoute {

  mapping = {methods: ["put"], path: "/reindex", handler: this.reindex};

  public reindex(req: express.Request, res: express.Response, next: express.NextFunction) {
    var handler = ResponseHelper.getHandler(req);
    if(handler == null){
      ResponseHelper.getDefaultHandler().handleNotAcceptable(req, res);
    }else {
      try {
        var env = ReindexRoute.getEnv(req);
        if(env == null){
          handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
          return;
        }

        var nodes = AggregationService.bootstrap().reindex(env);
        handler.handleProjects(req, res, nodes);
      } catch (e) {
        handler.handleInternalServerError(req, res, e);
      }
    }
  }

}