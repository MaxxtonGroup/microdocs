import * as express from "express";
import {ProjectTree, Problem, Project, ProblemResponse, ProblemLevels} from '@maxxton/microdocs-core/domain';
const yaml = require('js-yaml');
const xml = require('jsontoxml');
import {Injection} from "../../injections";

export class BaseResponseHandler {

  constructor(protected injection: Injection) {}

  handleProjects(req: express.Request, res: express.Response, projectTree: ProjectTree, env: string, injection: Injection) {
    this.response(req, res, 200, projectTree.unlink());
  }

  handleProject(req: express.Request, res: express.Response, project: Project, env: string, injection: Injection) {
    this.response(req, res, 200, project);
  }

  handleProblems(req: express.Request, res: express.Response, problems: Array<Problem>, env: string) {
    const problemResponse: ProblemResponse = {problems};
    if (problems.filter(problem => problem.level == ProblemLevels.ERROR || problem.level == ProblemLevels.WARNING).length == 0) {
      problemResponse.status = 'ok';
      problemResponse.message = 'No problems found';
    } else {
      problemResponse.status = 'failed';
      problemResponse.message = problems.length + " problem" + (problems.length > 1 ? 's' : '') + " found";
    }
    this.response(req, res, 200, problemResponse);
  }

  handleUnsupportedMediaType(req: express.Request, res: express.Response) {
    const contentType = req.header('content-type');
    this.handleError(req, res, {
      status: 415,
      error: 'Unsupported media type',
      message: 'Unsupported media type: ' + contentType
    });
  }

  handleNotAcceptable(req: express.Request, res: express.Response) {
    const accept = req.header('accept');
    this.handleError(req, res, {
      status: 406,
      error: 'Not Acceptable',
      message: 'Accept ' + accept + ' is not supported'
    });
  }

  handleBadRequest(req: express.Request, res: express.Response, message?: string) {
    this.handleError(req, res, {status: 400, error: 'Bad request', message});
  }

  handleNotFound(req: express.Request, res: express.Response, message?: string) {
    this.handleError(req, res, {status: 404, error: 'Not Found', message});
  }

  handleInternalServerError(req: express.Request, res: express.Response, error: Error) {
    console.error(error.stack);
    this.handleError(req, res, {status: 500, error: 'Internal Server Error', message: error.message});
  }

  handleError(req: express.Request, res: express.Response, error: ResponseError) {
    error.timestamp = new Date().getTime();
    error.path = req.path;
    if (error.message == undefined) {
      error.message = 'No message available';
    }
    if (error.error != undefined) {
      console.error(error.error);
    }
    this.response(req, res, error.status, error);
  }

  response(req: express.Request, res: express.Response, status: number, object: any) {
    if (req.get('accept') == undefined || req.accepts('json')) {
      this.responseJson(res, status, object);
    } else if (req.accepts('yml')) {
      this.responseYaml(res, status, object);
    } else if (req.accepts('xml')) {
      this.responseXml(res, status, object);
    } else {
      this.responseJson(res, status, object);
    }
  }

  protected responseJson(res: express.Response, status: number, object: any) {
    res
      .header('Access-Control-Allow-Origin', '*')
      .header('content-type', 'application/json')
      .status(status)
      .json(object);
  }

  protected responseYaml(res: express.Response, status: number, object: any) {
    res
      .header('Access-Control-Allow-Origin', '*')
      .header('content-type', 'application/x-yaml')
      .status(status)
      .send((yaml as any).dump(object));
  }

  protected responseXml(res: express.Response, status: number, object: any) {
    res
        .header('Access-Control-Allow-Origin', '*')
        .header('content-type', 'application/xml')
        .status(status)
        .send(xml(object));
  }

  protected responseText(res: express.Response, status: number, text: any) {
    res
        .header('Access-Control-Allow-Origin', '*')
        .header('content-type', 'text/plain')
        .status(status)
        .send(text);
  }

}

export interface ResponseError {

  status: number;
  error?: string;
  message?: string;
  timestamp?: number;
  path?: string;

}
