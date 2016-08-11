import * as express from "express";
import {TreeNode, Problem, Project} from 'microdocs-core-ts/dist/domain';
import {dump} from 'node-yaml';

export abstract class ResponseHandler {

  abstract handleProjects(req: express.Request, res: express.Response, treeNode: TreeNode);

  abstract handleProject(req: express.Request, res: express.Response, project: Project);

  abstract handleProblems(req: express.Request, res: express.Response, problems:Problem[]);

  handleNotAcceptable(req: express.Request, res: express.Response){
    var accept = req.header('accept');
    this.handleError(req, res, {status: 406, error: 'Not Acceptable', message: 'Accept ' + accept + ' is not supported'});
  }

  handleBadRequest(req: express.Request, res: express.Response, message?: string) {
    this.handleError(req, res, {status: 400, error: 'Bad request', message});
  }

  handleNotFound(req: express.Request, res: express.Response, message?: string) {
    this.handleError(req, res, {status: 404, error: 'Not Found', message: message});
  }

  handleInternalServerError(req: express.Request, res: express.Response, error:Error) {
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
    this.response(res, error.status, error);
  }

  abstract response(res: express.Response, status:number, object:any);

  responseJson(res: express.Response, status:number, json:any){
    res
      .header('Access-Control-Allow-Origin', '*')
      .header('content-type', 'application/json')
      .status(status)
      .json(json);
  }

  protected responseYaml(res: express.Response, status:number, yaml:any){
    res
      .header('Access-Control-Allow-Origin', '*')
      .header('content-type', 'application/yaml')
      .status(status)
      .send(dump(yaml));
  }

}

export interface ResponseError {

  status: number;
  error?: string;
  message?: string;
  timestamp?: number;
  path?: string;

}