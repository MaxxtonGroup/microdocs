/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {AggregationService} from '../services/aggregation.service';
import {Project, ProjectInfo, Problem} from "microdocs-core-ts/dist/domain";
import {ERROR, WARNING} from "microdocs-core-ts/dist/domain/problem/problem-level.model";
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";
import {ReportJsonRepository} from "../repositories/json/report-json.repo";
import {ResponseHelper} from "./responses/response.helper";

/**
 * @controller
 * @baseUrl /api/v1
 */
export class PublishRoute extends BaseRoute {

  mapping = {methods: ["put"], path: "/projects/:title", handler: this.publishProject, upload: true};

  /**
   * Publish new project definitions
   * @httpPut /projects/{title}
   * @httpPath title {string} name of the project
   * @httpQuery ?env {string} environment to publish the project definition
   * @httpQuery ?failOnProblems {boolean} either to publish when there are problems or
   * @httpQuery ?title {string} override the info.title in the project definitions
   * @httpQuery ?group {string} override the info.group in the project definitions
   * @httpQuery ?version {string} override the info.version in the project definitions
   * @httpResponse 200 {Problem[]}
   * @httpResponse 400 Missing title/version/group in the project definitions or missing request body
   */
  public publishProject(req: express.Request, res: express.Response, next: express.NextFunction, scope:BaseRoute) {
    var handler = ResponseHelper.getHandler(req);
    try {
      var env = scope.getEnv(req, scope);
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }

      var title = req.params.title;
      var version = req.query.version;
      var group = req.query.group;
      var failOnProblems: boolean = true;
      if (req.query.failOnProblems == 'false') {
        failOnProblems = false;
      }

      //get body
      var body = null;
      if (req.get('content-type') == 'application/json') {
        body = req.body;
      } else {
        handler.handleUnsupportedMediaType(req, res);
        return;
      }


      //check request body
      if (body != null) {
        var report = req.body as Project;

        //check version is provided
        if (version == undefined || version == "") {
          version = SchemaHelper.resolveReference("info.version", report);
        }
        if (version == undefined || version == null) {
          handler.handleBadRequest(req, res, "Missing version parameter");
          return;
        }

        //check group is provided
        if (group == undefined || group == "") {
          group = SchemaHelper.resolveReference("info.group", report);
        }
        if (group == undefined || group == null) {
          handler.handleBadRequest(req, res, "Missing group parameter");
          return;
        }

        //set group and version in the report
        if (report.info == undefined) {
          report.info = new ProjectInfo(undefined, undefined, undefined, undefined);
        }
        console.info(report.info);
        report.info.version = version;
        report.info.versions = [version];
        report.info.group = group;
        report.info.title = title;

        var aggregationService = scope.injection.AggregationService();
        
        // check report
        var reportCopy = JSON.parse(JSON.stringify(report));
        var problems: Problem[] = aggregationService.checkProject(env, reportCopy);

        if (!(failOnProblems && problems.filter(problem => problem.level == ERROR || problem.level == WARNING).length > 0)) {
          // save report
          scope.injection.ReportRepository().storeProject(env, report);

          // run reindex
          var treeNode = aggregationService.reindex(env);
        } else {
          console.warn("Fail publishing due to problems");
        }

        // return check result
        handler.handleProblems(req, res, problems, env);
      } else {
        handler.handleBadRequest(req, res, "Missing request body");
      }
    } catch (e) {
      handler.handleInternalServerError(req, res, e);
    }
  }

}