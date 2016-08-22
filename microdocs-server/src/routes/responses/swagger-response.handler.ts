import {BaseResponseHandler} from "./base-response.handler";
import {Project, Schema, Path, ProjectInfo, TreeNode} from "microdocs-core-ts/dist/domain";
import {DATE, STRING} from "microdocs-core-ts/dist/domain/schema/schema-type.model";
import * as express from "express";
import {MicroDocsResponseHandler} from "./microdocs-response.handler";

export class SwaggerResponseHandler extends MicroDocsResponseHandler {

  handleProjects(req: express.Request, res: express.Response, projects: TreeNode, env:string) {
    var project = this.mergeProjects(projects, env);

    this.response(req, res, 200, this.swagger(project));
  }

  handleProject(req: express.Request, res: express.Response, project: Project, env:string) {
    this.response(req, res, 200, this.swagger(project));
  }

  swagger(project: Project):{} {
    project.swagger = "2.0";
    delete project.dependencies;
    delete project.components;
    delete project.problems;
    delete project.problemCount;

    if(project.info != undefined){
      this.convertInfo(project.info);
    }

    if (project.definitions != undefined) {
      for (var key in project.definitions) {
        this.convertDefinition(project.definitions[key]);
      }
    }
    if (project.paths != undefined) {
      for (var path in project.paths) {
        for(var method in project.paths[path]){
          this.convertEndpoint(project.paths[path][method]);
        }
      }
    }
    return project;
  }

  convertEndpoint(path:Path){
    delete path.controller;
    delete path.method;
    delete path.problems;
    delete path.path;
    delete path.requestMethod;
    if(path.parameters != undefined){
      path.parameters.forEach(parameter => {
        if(parameter.schema != undefined){
          this.convertDefinition(parameter.schema);
        }
      });
    }
    if(path.responses != undefined){
      if(Object.keys(path.responses).length == 0){
        path.responses['default'] = {
          description: 'default response'
        };
      }else {
        for (var key in path.responses) {
          var response = path.responses[key];
          if (response.schema != undefined) {
            this.convertDefinition(response.schema);
          }
        }
      }
    }
  }

  convertDefinition(schema: Schema) {
    delete schema.mappings;
    delete schema.name;
    delete schema.simpleName;
    delete schema.genericName;
    delete schema.genericSimpleName;
    if (schema.properties != undefined) {
      for (var key in schema.properties) {
        this.convertDefinition(schema.properties[key]);
      }
    }
    if(schema.items != undefined){
      this.convertDefinition(schema.items);
    }
    if(schema.type == DATE){
      schema.type = STRING;
    }
  }

  convertInfo(info:ProjectInfo){
    delete info.group;
    delete info.versions;
    delete info.links;
    delete info.sourceLink;
  }

}