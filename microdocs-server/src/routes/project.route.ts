/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import * as aggregationRepo from "../repositories/json/aggregation-json.repo";

export class ProjectRoute extends BaseRoute {

    mapping = {methods: ['get'], path: '/projects/:title/:version', handler: this.projects};

    public projects(req:express.Request, res:express.Response, next:express.NextFunction) {
        var title = req.param.title;
        var version = req.param.version;
        var project = aggregationRepo.getAggregatedProject(title, version);
        if(project == null){
            res.status(404).send("Not found");
        }else{
            res.json(project);
        }
    }
}