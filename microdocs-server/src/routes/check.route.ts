/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {Problem, ProjectInfo, Project} from "microdocs-core-ts/dist/domain";
import {AggregationService} from "../services/aggregation.service";

export class CheckRoute extends BaseRoute {

  mapping = {methods: ['post'], path: '/check', handler: this.projects};

  public projects(req:express.Request, res:express.Response, next:express.NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");

    var project = req.body as Project;
    if (project != null && project != undefined) {
      if(project.info == null || project.info == undefined){
        project.info = new ProjectInfo(undefined, undefined, undefined, undefined);
      }
      if(project.info.title == null || project.info.title == undefined){
        if(req.query.project != undefined){
          project.info.title = req.query.project;
        }else{
          res.status(400).send('project param is missing');
          return;
        }
      }
      project.info.version = '9999999999.0.0';
      project.info.versions = ['9999999999.0.0'];

      var problems:Problem[] = AggregationService.bootstrap().checkProject(project);
      res.contentType("application/json");
      if (problems.length == 0) {
        res.json({status: 'ok', message: 'No problems found'});
      } else {
        res.json({
          status: 'failed',
          message: problems.length + " problem" + (problems.length > 1 ? 's' : '') + " found",
          problems: problems
        });
      }
    } else {
      res.status(400).send('Body is missing');
    }
  }
}