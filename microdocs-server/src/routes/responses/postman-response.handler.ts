import {Project, Schema, Path, ProjectInfo, TreeNode} from "microdocs-core-ts/dist/domain";
import {QUERY, PATH, BODY} from "microdocs-core-ts/dist/domain/path/parameter-placing.model";
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";
import * as uuid from 'uuid';


import * as express from "express";
import {MicroDocsResponseHandler} from "./microdocs-response.handler";
import {Config} from "../../config";
import {ProjectJsonRepository} from "../../repositories/json/project-json.repo";

export class PostmanResponseHandler extends MicroDocsResponseHandler {

  handleProjects(req: express.Request, res: express.Response, projects: TreeNode, env:string) {
    if(Object.keys(projects.dependencies).length == 1){
      var name = Object.keys(projects.dependencies)[0];
      var project = ProjectJsonRepository.bootstrap().getAggregatedProject(env, name, projects.dependencies[name].version);

      if(req.query['method']){
        var filterMethods = req.query['method'].split(',');
        this.filterMethods(project, filterMethods);
      }
      this.response(req, res, 200, this.postman(project));
    }else {
      this.response(req, res, 200, this.postmans(projects, env));
    }
  }

  handleProject(req: express.Request, res: express.Response, project: Project, env:string) {
    if(req.query['method']){
      var filterMethods = req.query['method'].split(',');
      this.filterMethods(project, filterMethods);
    }
    this.response(req, res, 200, this.postman(project));
  }

  postmans(projects: TreeNode, env:string):{}{
    var collection = this.getPostmanBase();

    for(var name in projects.dependencies){
      var project = ProjectJsonRepository.bootstrap().getAggregatedProject(env, name, projects.dependencies[name].version);
      var subCollection = this.getPostmanItems(project);
      collection['item'].push({
        name: name,
        description: 'Folder for ' + name,
        item: subCollection
      })
    }

    return collection;
  }

  postman(project: Project): {} {
    var collection = this.getPostmanBase(project);
    collection['item'] = this.getPostmanItems(project);

    return collection;
  }

  getPostmanItems(project: Project): {}[] {
    var items = [];
    if (project.paths != undefined) {
      for(var path in project.paths){
        for(var method in project.paths[path]){
          var item = this.getPostmanItem(path, method, project.paths[path][method]);
          items.push(item);
        }
      }
    }
    return items;
  }

  getPostmanItem(path:string, method:string, endpoint:Path):{}{
    var url = "{{baseUrl}}" + path;
    var body = {};
    var responses = [];
    if(endpoint.parameters != undefined){
      //replace path variables
      endpoint.parameters.filter(param => param.in == PATH).forEach(param => {
        var generatedValue = '{{' + param.name + '}}';
        if(param.default != undefined){
          generatedValue = param.default;
        }
        url.replace(new RegExp("{" + param.name + "}", 'g'), generatedValue);
      });

      // replace query params
      endpoint.parameters.filter(param => param.in == QUERY).forEach(param => {
        var generatedValue = '{{' + param.name + '}}';
        if(param.default != undefined){
          generatedValue = param.default;
        }
        if(url.indexOf("?") == -1){
          url += '?';
        }else{
          url += '&';
        }
        url += encodeURIComponent(param.name) + '=' + encodeURIComponent(generatedValue);
      });

      // add body
      endpoint.parameters.filter(param => param.in == BODY).forEach(param => {
        body = {
          mode: 'raw',
          raw: JSON.stringify(param.default, null, '  ')
        };
      });
    }

    if(endpoint.responses != undefined){
      var defaultResponse = endpoint.responses['default'];
      if(Object.keys(endpoint.responses).length == 1 && defaultResponse != undefined){
        var response = {};
        if(defaultResponse.schema != undefined && defaultResponse.schema.default != undefined){
          response['body'] = JSON.stringify(defaultResponse.schema.default, null, '  ');
        }
        responses.push(response);
      }else{
        for(var status in endpoint.responses){
          var response = {status: status};
          if(endpoint.responses[status].schema != undefined && endpoint.responses[status].schema.default != undefined){
            response['body'] = JSON.stringify(endpoint.responses[status].schema.default, null, '  ');
          }else if(defaultResponse.schema != undefined && defaultResponse.schema.default != undefined){
            response['body'] = JSON.stringify(defaultResponse.schema.default, null, '  ');
          }
          responses.push(response);
        }
      }
    }

    return {
      name: path,
      request: {
        url: url,
        method: method.toUpperCase(),
        description: endpoint.description,
        body: body
      },
      response: responses
    };
  }

  getPostmanBase(project?:Project): {} {
    var collection = {item: [], info:{}};
    if(project){
      collection['info'] = {
        name: project.info.title,
        version: project.info.version,
        description: project.info.description
      };
    }else{
      collection['info'] = {
        name: Config.get('application-name'),
        version: Config.get('application-version').toString(),
        description: Config.get('application-description')
      };
    }
    collection.info['schema'] = "https://schema.getpostman.com/json/collection/v2.0.0/collection.json";
    collection.info['_postman_id'] = uuid['v4']();

    // get base url
    var schema = Config.get('application-schema');
    var host = Config.get('application-host');
    var basePath = Config.get('application-basePath');
    var host = "localhost:8080";
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