import {BaseResponseHandler} from "./base-response.handler";
import {Project, Schema, Path, ProjectInfo, TreeNode} from "@maxxton/microdocs-core/domain";
import * as express from "express";
import {Config} from "../../config";
import {ProjectJsonRepository} from "../../repositories/json/project-json.repo";

export class MicroDocsResponseHandler extends BaseResponseHandler {

  handleProjects(req: express.Request, res: express.Response, projects: TreeNode, env: string) {
    var filterMethods = [];
    if(req.query['method']){
      filterMethods = req.query['method'].split(',');
    }
    var project = this.mergeProjects(projects, filterMethods, env);

    this.response(req, res, 200, project);
  }

  handleProject(req: express.Request, res: express.Response, project: Project, env: string) {
    if(req.query['method']){
      var filterMethods = req.query['method'].split(',');
      this.filterMethods(project, filterMethods);
    }
    this.response(req, res, 200, project);
  }

  protected mergeProjects(node: TreeNode, filterMethods:string[], env: string): Project {
    var project: Project = this.getGlobalInfo();

    project.definitions = {};
    project.paths = {};
    for (var title in node.dependencies) {
      var subProject = new ProjectJsonRepository().getAggregatedProject(env, title, node.dependencies[title].version);
      this.filterMethods(subProject, filterMethods);

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

  protected getGlobalInfo(): Project {
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
    return project;
  }

  protected filterMethods(project:Project, requestMethods:string[]){
    if(project.paths){
      var removePaths:string[] = [];
      for(var path in project.paths){
        var removeMethods:string[] = [];
        for(var method in project.paths[path]){
          for(var i = 0; i < requestMethods.length; i++){
            var filterMethod = requestMethods[i];
            if(filterMethod.indexOf('!') == 0){
              if(method.toLowerCase() === filterMethod.substring(1).toLowerCase()){
                removeMethods.push(method);
              }
            }else{
              if(method.toLowerCase() !== filterMethod.toLowerCase()){
                removeMethods.push(method);
              }
            }
          }
        }
        removeMethods.forEach(removeMethod => delete project.paths[path][method]);
        if(Object.keys(project.paths[path]).length == 0){
          removePaths.push(path);
        }
      }
      removePaths.forEach(removePath => delete project.paths[removePath]);
    }
  }

}