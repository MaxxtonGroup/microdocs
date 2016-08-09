import * as express from "express";
import {TreeNode, Project, Problem} from 'microdocs-core-ts/dist/domain';
import {ERROR, WARNING} from "microdocs-core-ts/dist/domain/problem/problem-level.model";
import {ResponseHandler} from "./response.handler";

export class YamlResponseHandler extends ResponseHandler{

  handleProjects(req: express.Request, res: express.Response, treeNode: TreeNode) {
    this.response(res, 200, treeNode.unlink());
  }

  handleProject(req: express.Request, res: express.Response, project: Project) {
    this.response(res, 200, project);
  }

  handleProblems(req: express.Request, res: express.Response, problems: Problem[]) {
    var object = {problems: problems};
    if (problems.filter(problem => problem.level == ERROR || problem.level == WARNING).length == 0){
      object['status'] = 'ok';
      object['message'] = 'No problems found';
    } else {
      object['status'] = 'failed';
      object['message'] = problems.length + " problem" + (problems.length > 1 ? 's' : '') + " found";
    }
    this.response(res, 200, object);
  }

  response = this.responseYaml;

}