/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {ResponseHelper} from "./responses/response.helper";
import {RootNode, ProjectNode, DependencyNode} from '@maxxton/microdocs-core-ts/dist/domain';
import {ProjectRepository} from "../repositories/project.repo";

/**
 * @controller
 * @baseUrl /api/v1
 */
export class ProjectsRoute extends BaseRoute {
  
  mapping = {methods: ['get'], path: '/projects', handler: this.projects};
<<<<<<< HEAD
  
  public projects(req:express.Request, res:express.Response, next:express.NextFunction, scope:BaseRoute) {
=======

  /**
   * @httpGet /projects
   * @httpQuery ?env {string}
   * @httpQuery ?groups {string[]} filter to include or exclude groups with a '!' in front
   * @httpQuery ?projects {string[]} filter to include or exclude groups with a '!' in front
   * @httpResponse 200 {TreeNode}
   */
  public projects(req: express.Request, res: express.Response, next: express.NextFunction, scope:BaseRoute) {
>>>>>>> development
    var handler = ResponseHelper.getHandler(req);
    try {
      var env = scope.getEnv(req, scope);
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }
      
      var rootNode = scope.injection.ProjectRepository().getAggregatedProjects(env);
      if (rootNode == null) {
        rootNode = new RootNode();
      }
      
      var groups:string[] = [];
      var titles:string[] = [];
      if (req.query.groups != undefined) {
        groups = req.query.groups.split(',');
      }
      if (req.query.projects != undefined) {
        titles = req.query.projects.split(',');
      }
      rootNode = filterRoot(rootNode, groups, titles);
      
      ResponseHelper.getHandler(req).handleProjects(req, res, rootNode, env);
    } catch (e) {
      ResponseHelper.getHandler(req).handleInternalServerError(req, res, e);
    }
  }
}

function filterRoot(root:RootNode, groups:string[], projects:string[]):RootNode{
  var removeProjects:ProjectNode[] = [];
  root.projects.forEach(project => {
    if(filterProject(project, groups, projects)){
      removeProjects.push(project);
    }else{
      filterProjects(project, groups, projects);
    }
  });
  removeProjects.forEach(project => delete root.projects[root.projects.indexOf(project)]);
  
  return root;
}

function filterProjects(projectNode:ProjectNode, groups:string[], projects:string[]):ProjectNode{
  var removeDependency:DependencyNode[] = [];
  projectNode.dependencies.forEach(dependency => {
    if(filterProject(dependency.item, groups, projects)){
      removeDependency.push(dependency);
    }else{
      filterProject(dependency.item, groups, projects);
    }
  });
  removeDependency.forEach(dependency => delete projectNode.dependencies[projectNode.dependencies.indexOf(dependency)]);
  
  return projectNode;
}

function filterProject(project:ProjectNode, groups:string[], projects:string[]):boolean {
  var filter = false;
  
  // filter project
  projects.forEach(fTitle => {
    if (fTitle.indexOf('!') == 0) {
      //ignore
      fTitle = fTitle.substring(1);
      if (project.title == fTitle) {
        filter = true;
      }
    } else {
      //select
      if (project.title != fTitle) {
        filter = true;
      }
    }
  });
  
  // filter groups
  groups.forEach(group => {
    if (group.indexOf('!') == 0) {
      //ignore
      group = group.substring(1);
      if (project.group == group) {
        filter = true;
      }
    } else {
      //select
      if (project.group != group) {
        filter = true;
      }
    }
  });
  return filter;
}