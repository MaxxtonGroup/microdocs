/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {ProjectJsonRepository} from "../repositories/json/project-json.repo";
import {ResponseHelper} from "./responses/response.helper";
import {TreeNode} from 'microdocs-core-ts/dist/domain';

export class ProjectsRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/projects', handler: this.projects};

  public projects(req: express.Request, res: express.Response, next: express.NextFunction) {
    var handler = ResponseHelper.getHandler(req);
    if (handler == null) {
      ResponseHelper.getDefaultHandler().handleNotAcceptable(req, res);
    } else {
      try {
        var projects = ProjectJsonRepository.bootstrap().getAggregatedProjects();

        var groups: string[] = [];
        var titles: string[] = [];
        if (req.query.groups != undefined) {
          groups = req.query.groups.split(',');
        }
        if (req.query.projects != undefined) {
          titles = req.query.projects.split(',');
        }
        projects = ProjectsRoute.filterProjects(projects, groups, titles);

        ResponseHelper.getHandler(req).handleProjects(req, res, projects);
      } catch (e) {
        ResponseHelper.getHandler(req).handleInternalServerError(req, res, e);
      }
    }
  }

  private static filterProjects(project: TreeNode, groups: string[], projects: string[]): TreeNode {
    // find removed projects
    var removedProjects: string[] = [];
    if (project.dependencies != undefined) {
      for (var title in project.dependencies) {
        var filter = false;

        // filter project
        projects.forEach(fTitle => {
          if(fTitle.indexOf('!') == 0){
            //ignore
            fTitle = fTitle.substring(1);
            if(title == fTitle){
              filter = true;
            }
          }else{
            //select
            if(title != fTitle){
              filter = true;
            }
          }
        });

        // filter groups
        groups.forEach(group => {
          if(group.indexOf('!') == 0){
            //ignore
            group = group.substring(1);
            if(project.dependencies[title].group == group){
              filter = true;
            }
          }else{
            //select
            if(project.dependencies[title].group != group){
              filter = true;
            }
          }
        });

        if(filter){
          removedProjects.push(title);
        }else{
          this.filterProjects(project.dependencies[title], projects, groups);
        }
      }
    }

    // remove projects
    removedProjects.forEach(title => delete project.dependencies[title]);

    // return filtered projects
    return project;
  }
}