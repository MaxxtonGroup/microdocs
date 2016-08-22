import {BaseResponseHandler} from "./base-response.handler";
import {Project, Schema, Path, ProjectInfo, TreeNode} from "microdocs-core-ts/dist/domain";
import * as express from "express";
import {Config} from "../../config";
import {ProjectJsonRepository} from "../../repositories/json/project-json.repo";

export class MicroDocsResponseHandler extends BaseResponseHandler {

  handleProjects(req: express.Request, res: express.Response, projects: TreeNode, env:string) {
    var project = this.mergeProjects(projects, env);

    this.response(req, res, 200, project);
  }

  handleProject(req: express.Request, res: express.Response, project: Project, env:string) {
    this.response(req, res, 200, project);
  }

  protected mergeProjects(node: TreeNode, env:string): Project {
    var project: Project = {};
    project.info = <ProjectInfo>{
      title: Config.get('application-name'),
      group: undefined,
      version: Config.get('application-version').toString(),
      versions: [Config.get('application-version').toString()],
      description: Config.get('application-description')
    };
    project.schemas = [Config.get('application-schema')];
    project.host = Config.get('application-host');
    project.basePath = Config.get('application-basePath');

    project.definitions = {};
    project.paths = {};
    for (var title in node.dependencies) {
      var subProject = ProjectJsonRepository.bootstrap().getAggregatedProject(env, title, node.dependencies[title].version);

      if (subProject.definitions != undefined) {
        for (var key in subProject.definitions) {
          project.definitions[key] = subProject.definitions[key];
        }
      }

      if (subProject.paths != undefined) {
        for (var path in subProject.paths) {
          if (project.paths[path] == undefined) {
            project.paths[path] = {};
          }
          for (var method in subProject.paths[path]) {
            var endpoint = subProject.paths[path][method];
            project.paths[path][method] = endpoint;
          }
        }
      }
    }
    return project;
  }

}