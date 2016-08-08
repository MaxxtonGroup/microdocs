/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {AggregationService} from '../services/aggregation.service';
import {Project, ProjectInfo, Problem} from "microdocs-core-ts/dist/domain";
import {ERROR,WARNING} from "microdocs-core-ts/dist/domain/problem/problem-level.model";
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";
import {ReportJsonRepository} from "../repositories/json/report-json.repo";

/**
 * @author Steven Hermans
 */
export class PublishRoute extends BaseRoute {

  mapping = {methods: ["put"], path: "/projects/:title", handler: this.publishProject};

  public publishProject(req:express.Request, res:express.Response, next:express.NextFunction) {
    var title = req.params.title;
    var version = req.query.version;
    var group = req.query.group;
    var failOnProblems:boolean = true;
    if(req.query.failOnProblems == 'false'){
      failOnProblems = false;
    }

    //check request body
    if (req.get("content-type") == "application/json") {
      var report = req.body as Project;
      if (report != undefined) {

        //check version is provided
        if (version == undefined || version == "") {
          version = SchemaHelper.resolveReference("info.version", report);
        }
        if (version == undefined || version == null) {
          res.status(400).send("Missing version parameter");
          return;
        }

        //check group is provided
        if (group == undefined || group == "") {
          group = SchemaHelper.resolveReference("info.group", report);
        }
        if (group == undefined || group == null) {
          res.status(400).send("Missing group parameter");
          return;
        }

        //set group and version in the report
        if(report.info == undefined){
          report.info = new ProjectInfo(undefined, undefined, undefined, undefined);
        }
        console.info(report.info);
        report.info.version = version;
        report.info.versions = [version];
        report.info.group = group;
        report.info.title = title;

        // check report
        var problems:Problem[] = AggregationService.bootstrap().checkProject(report);

        if(!(failOnProblems && problems.filter(problem => problem.level == ERROR || problem.level == WARNING).length > 0)){
          // save report
          ReportJsonRepository.bootstrap().storeProject(report);

          // run reindex
          var treeNode = AggregationService.bootstrap().reindex();
        }else{
          console.warn("Fail publishing due to problems");
        }

        // return check result
        res.contentType("application/json");
        if (problems.filter(problem => problem.level == ERROR || problem.level == WARNING).length == 0) {
          res.json({status: 'ok', message: 'No problems found'});
        } else {
          res.json({
            status: 'failed',
            message: problems.length + " problem" + (problems.length > 1 ? 's' : '') + " found",
            problems: problems
          });
        }

      } else {
        res.status(400).send("Missing request body");
      }
    } else {
      res.status(415).send("Unsupported Media type");
    }

  }

}