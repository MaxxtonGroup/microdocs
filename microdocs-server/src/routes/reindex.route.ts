/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {AggregationService} from '../services/aggregation.service';

/**
 * @author Steven Hermans
 */
export class ReindexRoute extends BaseRoute {

    mapping = {methods: ["put"], path: "/reindex", handler: this.reindex};
    public reindex(req:express.Request, res:express.Response, next:express.NextFunction) {
        res.json(AggregationService.bootstrap().reindex().unlink());
    }

}