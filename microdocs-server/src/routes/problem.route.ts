/// <reference path="../_all.d.ts" />

import * as express from "express";

import {BaseRoute} from "./route";
import {ProjectJsonRepository} from "../repositories/json/project-json.repo";
import {ProjectRepository} from "../repositories/project.repo";

export class ProjectRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/projects/:title', handler: this.projects};

  public projects(req:express.Request, res:express.Response, next:express.NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");

    var title = req.params.title;
    var version = req.query.version;
    console.info(version);


    // load latest version if not specified
    if (version == undefined) {
      var rootNode = ProjectJsonRepository.bootstrap().getAggregatedProjects();
      if (rootNode.dependencies != undefined) {
        for(var key in rootNode.dependencies){
          if(key == title){
            version = rootNode.dependencies[key].version;
            break;
          }
        }
      }
    }

    if (version != undefined) {
      // load project
      var project = ProjectJsonRepository.bootstrap().getAggregatedProject(title, version);

      // return project
      if (project == null) {
        res.status(404).send("Not found");
      } else {
        res.contentType("application/json");
        res.json(project);
      }
    } else {
      res.status(404).send("Not found");
    }
  }
}