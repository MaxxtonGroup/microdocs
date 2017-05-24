
import {Project, Schema, Path, ProjectInfo, ProjectTree, ParameterPlacings} from "@maxxton/microdocs-core/domain";
import * as uuid from 'uuid';
import * as express from "express";
import {MicroDocsResponseHandler} from "./microdocs-response.handler";
import {Config} from "../../config";
import {ProjectJsonRepository} from "../../repositories/json/project-json.repo";
import { PostmanAdapter } from  "@maxxton/microdocs-core/adapter";

export class PostmanResponseHandler extends MicroDocsResponseHandler {

  handleProjects(req: express.Request, res: express.Response, projectTree: ProjectTree, env: string) {
    if (projectTree.projects.length == 1) {
      var projectNode = projectTree.projects[0];
      var project = this.injection.ProjectRepository().getAggregatedProject(env, projectNode.title, projectNode.version);

      if (req.query['method']) {
        var filterMethods = req.query['method'].split(',');
        this.filterMethods(project, filterMethods);
      }
      this.response(req, res, 200, this.postman(project));
    } else {
      this.response(req, res, 200, this.postmans(projectTree, env));
    }
  }

  handleProject(req: express.Request, res: express.Response, project: Project, env: string) {
    if (req.query['method']) {
      var filterMethods = req.query['method'].split(',');
      this.filterMethods(project, filterMethods);
    }
    this.response(req, res, 200, this.postman(project));
  }

  postmans(projectTree: ProjectTree, env: string): {} {
    let postmanAdapter = new MyPostmanAdapter();
    var collection: any = postmanAdapter.getPostmanBase();

    projectTree.projects.forEach(projectNode => {
      var project = this.injection.ProjectRepository().getAggregatedProject(env, projectNode.title, projectNode.version);
      var subCollection = postmanAdapter.adapt(project);
      collection.item.push({
        name: projectNode.title,
        description: project.info && project.info.description ? project.info.description : 'Folder for ' + projectNode.title,
        item: subCollection
      })
    });

    return collection;
  }

  postman(project: Project): {} {
    let postmanAdapter = new MyPostmanAdapter();
    var collection: any = postmanAdapter.getPostmanBase(project);
    collection.item = postmanAdapter.adapt(project);
    return collection;
  }
}

class MyPostmanAdapter extends PostmanAdapter {
  adapt(project: Project): {}[] {
    return super.adapt(project);
  }

  getPostmanBase(project?: Project): {} {
    var collection: any = { item: [], info: {} };

    collection['info'] = {
      name: Config.get('application-name'),
      version: Config.get('application-version').toString(),
      description: Config.get('application-description')
    };
    collection.info.schema = "https://schema.getpostman.com/json/collection/v2.0.0/collection.json";
    collection.info._postman_id = uuid['v4']();

    // get base url
    var schema: string = Config.get('application-schema');
    var host: string = Config.get('application-host');
    var basePath: string = Config.get('application-basePath');
    var host: string = "localhost:8080";
    while (basePath.indexOf('/') == 0) {
      basePath = basePath.substr(1);
    }

    var baseUrl = schema + "://" + host + "/" + basePath;
    collection['variables'] = [
      {
        id: 'baseUrl',
        type: 'string',
        value: baseUrl
      }
    ];

    return collection;
  }
}
