/// <reference path="../_all.d.ts" />
"use strict";

import * as express from "express";
import {BaseRoute} from "./route";

export class ProjectsRoute extends BaseRoute {

    mapping = {methods: ['get'], path: '/projects', handler: this.projects};

    public projects(req:express.Request, res:express.Response, next:express.NextFunction) {
        res.jsonp({message: "hello"});
    }
}