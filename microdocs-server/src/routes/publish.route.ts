
import * as express from "express";

import { BaseRoute } from "./route";
import { Project, ProjectInfo, Problem, ProblemLevels } from "@maxxton/microdocs-core/dist/domain";
import { SchemaHelper } from "@maxxton/microdocs-core/dist/helpers/schema/schema.helper";

export class PublishZipRoute extends BaseRoute {

  mapping = { methods: [ "put" ], path: "/projects/:title", handler: this.publishProject, upload: true };

  /**
   * Publish new project definitions
   * @httpPut /api/v1/projects/{title}
   * @httpPath title {string} name of the project
   * @httpQuery ?env {string} environment to publish the project definition
   * @httpQuery ?failOnProblems {boolean} either to publish when there are problems or
   * @httpQuery ?title {string} override the info.title in the project definitions
   * @httpQuery ?group {string} override the info.group in the project definitions
   * @httpQuery ?version {string} override the info.version in the project definitions
   * @httpResponse 200 {ProblemResponse}
   * @httpResponse 400 Missing title/version/group in the project definitions or missing request body
   */
  public publishProject( req: express.Request, res: express.Response, next: express.NextFunction, scope: BaseRoute ) {
//    let tempFolder = getTempFolder()
    next();
  }
}


/**
 * @controller
 * @baseUrl /api/v1
 */
export class PublishRoute extends BaseRoute {

  mapping = { methods: [ "put" ], path: "/projects/:title", handler: this.publishProject, upload: false };

  /**
   * Publish new project definitions
   * @httpPut /projects/{title}
   * @httpPath title {string} name of the project
   * @httpQuery ?env {string} environment to publish the project definition
   * @httpQuery ?failOnProblems {boolean} either to publish when there are problems or
   * @httpQuery ?title {string} override the info.title in the project definitions
   * @httpQuery ?group {string} override the info.group in the project definitions
   * @httpQuery ?version {string} override the info.version in the project definitions
   * @httpResponse 200 {ProblemResponse}
   * @httpResponse 400 Missing title/version/group in the project definitions or missing request body
   */
  public publishProject( req: express.Request & {_body: any}, res: express.Response, next: express.NextFunction, scope: BaseRoute ) {
    const handler = scope.getHandler( req );
    try {
      const env = scope.getEnv( req, scope );
      if ( env == null ) {
        handler.handleBadRequest( req, res, "env '" + req.query.env + "' doesn't exists" );
        return;
      }

      const title                  = req.params.title;
      let version                = req.query.version;
      let group                  = req.query.group;
      if (group) {
        group = decodeURIComponent(group as string);
      }
      let failOnProblems = true;
      if (!req.query.force) {
        failOnProblems = false;
      }
      if ( req.query.failOnProblems == 'false' ) {
        failOnProblems = false;
      }

      // get body
      let report: Project = null;
      if ( req._body ) {
        report = req.body;
      } else {
        handler.handleUnsupportedMediaType( req, res );
        return;
      }


      // check request body
      if ( report ) {
        // check version is provided
        if ( version == undefined || version == "" ) {
          version = SchemaHelper.resolveReference( "info.version", report );
        }
        if ( version == undefined || version == null ) {
          handler.handleBadRequest( req, res, "Missing version parameter" );
          return;
        }

        // check group is provided
        if ( group == undefined || group == "" ) {
          group = SchemaHelper.resolveReference( "info.group", report );
        }
        if ( group == undefined || group == null ) {
          handler.handleBadRequest( req, res, "Missing group parameter" );
          return;
        }
        const links = report.info && report.info.links;
        const description = report.info && report.info.description;
        const sourceLink = report.info && report.info.sourceLink;
        const color = report.info && report.info.color;


        // set group and version in the report
        report.info = new ProjectInfo(title, group as string, version as string, [version as string], links, description, sourceLink, new Date().toISOString(), undefined, color);

        const aggregationService = scope.injection.AggregationService();

        // check report
        const reportCopy         = JSON.parse( JSON.stringify( report ) );
        const problems: Array<Problem> = aggregationService.checkProject( env, reportCopy );

        if ( !(failOnProblems && problems.filter( problem => problem.level == ProblemLevels.ERROR || problem.level == ProblemLevels.WARNING ).length > 0) ) {
          // save report
          scope.injection.ReportRepository().storeProject( env, report );

          // run reindex
          const treeNode = aggregationService.reindex( env );
        } else {
          console.warn( "Fail publishing due to problems" );
        }

        // return check result
        handler.handleProblems( req, res, problems, env );
      } else {
        handler.handleBadRequest( req, res, "Missing request body" );
      }
    } catch ( e ) {
      scope.getDefaultHandler().handleInternalServerError( req, res, e );
    }
  }

}
