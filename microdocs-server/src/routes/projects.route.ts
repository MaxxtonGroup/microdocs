/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {ProjectJsonRepository} from "../repositories/json/project-json.repo";

export class ProjectsRoute extends BaseRoute {

    mapping = {methods: ['get'], path: '/projects', handler: this.projects};

    public projects(req:express.Request, res:express.Response, next:express.NextFunction) {
        var projects = ProjectJsonRepository.bootstrap().getAggregatedProjects().unlink();
        res.header("Access-Control-Allow-Origin", "*");
        res.contentType("application/json");
        res.json(projects);
    }
}