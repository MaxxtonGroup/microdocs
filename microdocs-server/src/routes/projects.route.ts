/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import * as aggregationRepo from "../repositories/json/aggregation-json.repo";

export class ProjectsRoute extends BaseRoute {

    mapping = {methods: ['get'], path: '/projects', handler: this.projects};

    public projects(req:express.Request, res:express.Response, next:express.NextFunction) {
        console.info(aggregationRepo.getAggregatedProjects().unlink());
        var projects = aggregationRepo.getAggregatedProjects().unlink();
        res.json(projects);
    }
}