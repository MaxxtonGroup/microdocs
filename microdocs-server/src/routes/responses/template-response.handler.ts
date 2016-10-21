/// <reference path="../../_all.d.ts" />

import * as express from "express";
import {TreeNode, Problem, Project, Schema} from '@maxxton/microdocs-core-ts/dist/domain';
import {SchemaHelper} from '@maxxton/microdocs-core-ts/dist/helpers';
import {ERROR, WARNING} from "@maxxton/microdocs-core-ts/dist/domain/problem/problem-level.model";
import {Config} from "../../config";
import * as fs from 'fs';
import {MicroDocsResponseHandler} from "./microdocs-response.handler";
import {ProjectJsonRepository} from "../../repositories/json/project-json.repo";
import * as Handlebars from 'handlebars';

export class TemplateResponseHandler extends MicroDocsResponseHandler {

  constructor(private templateName: string) {
  }

  handleProjects(req: express.Request, res: express.Response, treeNode: TreeNode, env: string) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain');

    if (this.existView('projects')) {
      var global = this.getGlobalInfo();
      var projects = [];
      for (var title in treeNode.dependencies) {
        var project = ProjectJsonRepository.bootstrap().getAggregatedProject(env, title, treeNode.dependencies[title].version);

        if(req.query['method']){
          var filterMethods = req.query['method'].split(',');
          this.filterMethods(project, filterMethods);
        }
        projects.push(project);
      }
      res.render(this.getViewFile('projects'), {projects: projects, global: global, node: treeNode, env: env});

    } else if (this.existView('project')){
      var filterMethods = [];
      if(req.query['method']) {
        filterMethods = req.query['method'].split(',');
      }
      var project = this.mergeProjects(treeNode, filterMethods, env);
      this.handleProject(req, res, project, env);

    } else {
      this.handleBadRequest(req, res, "Unknown export type: " + this.templateName);
    }
  }

  handleProject(req: express.Request, res: express.Response, project: Project, env: string) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain');
    if (this.existView('project')) {
      if(req.query['method']){
        var filterMethods = req.query['method'].split(',');
        this.filterMethods(project, filterMethods);
      }
      res.render(this.getViewFile('project'), {project: project, env: env});
    } else {
      this.handleBadRequest(req, res, "Unknown export type: " + this.templateName);
    }
  }

  handleProblems(req: express.Request, res: express.Response, problems: Problem[], env: string) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain');
    if (this.existView('problems')) {
      var object = {problems: problems};
      if (problems.filter(problem => problem.level == ERROR || problem.level == WARNING).length == 0) {
        object['status'] = 'ok';
        object['message'] = 'No problems found';
      } else {
        object['status'] = 'failed';
        object['message'] = problems.length + " problem" + (problems.length > 1 ? 's' : '') + " found";
      }
      res.render(this.getViewFile('problems'), object);
    } else {
      this.handleBadRequest(req, res, "Unknown export type: " + this.templateName);
    }
  }

  private existView(type: string): boolean {
    return fs.existsSync('dist/' + Config.get('viewFolder') + '/' + this.getViewFile(type) + '.handlebars');
  }

  private getViewFile(type: string): string {
    return this.templateName + "-" + type;
  }

}

Handlebars.registerHelper('toUpperCase', function(str) {
  return str.toUpperCase();
});
Handlebars.registerHelper('ifEq', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
Handlebars.registerHelper('ifEq', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
Handlebars.registerHelper('ifNotEmpty', function(v1, options) {
  if(v1) {
    if(typeof(v1) === 'string'){
      if(v1.length > 0){
        return options.fn(this);
      }
    }else if(Array.isArray(v1)){
      if(v1.length > 0){
        return options.fn(this);
      }
    }else if(typeof(v1) === 'object'){
      if(Object.keys(v1).length > 0){
        return options.fn(this);
      }
    }else{
      return options.fn(this);
    }
  }
  return options.inverse(this);
});

Handlebars.registerHelper('schemaResolver', function(schema:Schema, rootObject:{}, offset?:number) {
  return asJson(SchemaHelper.resolveObject(schema, rootObject), offset);
});

Handlebars.registerHelper('schemaExample', function(schema:Schema, rootObject:{}, offset?:number) {
  var example = SchemaHelper.generateExample(schema, undefined, [], rootObject);
  console.info(example);
  return asJson(example, offset);
});

var asJson = function(object:any, offset?:number) {
  var spaces = '';
  for(var i = 0; i < offset; i++){
    spaces += ' ';
  }
  var json = JSON.stringify(object, undefined, 4);
  if(json){
    return json.replace(/\n/g, '\n' + spaces);
  }
  return '';
};
Handlebars.registerHelper('asJson', asJson);