import {Project, Schema, Path, ProjectInfo, ProjectTree, SchemaTypes} from "@maxxton/microdocs-core/domain";
import * as express from "express";
import {MicroDocsResponseHandler} from "./microdocs-response.handler";
import { SwaggerAdapter } from  "@maxxton/microdocs-core/adapter";

export class SwaggerResponseHandler extends MicroDocsResponseHandler {

  handleProjects(req: express.Request, res: express.Response, projectTree: ProjectTree, env: string) {
    let filterMethods: Array<string> = [];
    if (req.query['method']) {
      filterMethods = (req.query['method']as string).split(',');
    }
    const project = this.mergeProjects(projectTree, filterMethods, env);

    this.response(req, res, 200, this.swagger(project));
  }

  handleProject(req: express.Request, res: express.Response, project: Project, env: string) {
    if (req.query['method']) {
      const filterMethods = (req.query['method']as string).split(',');
      this.filterMethods(project, filterMethods);
    }
    this.response(req, res, 200, this.swagger(project));
  }

  swagger(project: Project): {} {
    const swaggerAdapter = new SwaggerAdapter();
    swaggerAdapter.adapt(project);
    return project;
  }
}
