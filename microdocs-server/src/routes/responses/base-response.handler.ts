import * as express from "express";
import {TreeNode, Problem, Project, ProblemResponse} from '@maxxton/microdocs-core/domain';
import * as dump from 'js-yaml';
import * as xml from 'jsontoxml';
import {ERROR, WARNING} from "@maxxton/microdocs-core/domain/problem/problem-level.model";

export class BaseResponseHandler {

  handleProjects(req: express.Request, res: express.Response, treeNode: TreeNode, env:string) {
    this.response(req, res, 200, treeNode.unlink());
  }

  handleProject(req: express.Request, res: express.Response, project: Project, env:string) {
    this.response(req, res, 200, project);
  }

  handleProblems(req: express.Request, res: express.Response, problems: Problem[], env:string) {
    var problemResponse:ProblemResponse = {problems: problems};
    if (problems.filter(problem => problem.level == ERROR || problem.level == WARNING).length == 0){
      problemResponse.status = 'ok';
      problemResponse.message = 'No problems found';
    } else {
      problemResponse.status = 'failed';
      problemResponse.message = problems.length + " problem" + (problems.length > 1 ? 's' : '') + " found";
    }
    this.response(req, res, 200, problemResponse);
  }

  handleUnsupportedMediaType(req: express.Request, res: express.Response) {
    var contentType = req.header('content-type');
    this.handleError(req, res, {
      status: 415,
      error: 'Unsupported media type',
      message: 'Unsupported media type: ' + contentType
    });
  }

  handleNotAcceptable(req: express.Request, res: express.Response) {
    var accept = req.header('accept');
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
    this.handleError(req, res, {status: 404, error: 'Not Found', message: message});
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
    if(req.get('accept') == undefined || req.accepts('json')){
      this.responseJson(res, status, object);
    }else if (req.accepts('yml')) {
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
      .header('content-type', 'application/yaml')
      .status(status)
      .send(dump(object));
  }

  protected responseXml(res: express.Response, status: number, object: any) {
    res
      .header('Access-Control-Allow-Origin', '*')
      .header('content-type', 'application/xml')
      .status(status)
      .send(xml(object));
  }

}

export interface ResponseError {

  status: number;
  error?: string;
  message?: string;
  timestamp?: number;
  path?: string;

}