import {Project, Schema, Path, ProjectInfo, TreeNode} from "microdocs-core-ts/dist/domain";
import {QUERY, PATH, BODY} from "microdocs-core-ts/dist/domain/path/parameter-placing.model";
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";


import * as express from "express";
import {MicroDocsResponseHandler} from "./microdocs-response.handler";
import {Config} from "../../config";
import {ProjectJsonRepository} from "../../repositories/json/project-json.repo";

export class PostmanResponseHandler extends MicroDocsResponseHandler {

  handleProjects(req: express.Request, res: express.Response, projects: TreeNode) {
    this.response(req, res, 200, this.postmans(projects));
  }

  handleProject(req: express.Request, res: express.Response, project: Project) {
    this.response(req, res, 200, this.postman([project]));
  }

  postmans(projects: TreeNode):{}{
    var collection = this.getPostmanBase();

    for(var name in projects.dependencies){
      var project = ProjectJsonRepository.bootstrap().getAggregatedProject(name, projects.dependencies[name].version);
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
    var collection = this.getPostmanBase();
    collection['item'] = this.getPostmanItems(project);

    return collection;
  }

  getPostmanItems(project: Project): {}[] {
    var items = [];
    if (project.paths != undefined) {
      for(var path in project.paths){
        var folder = {
          name: path,
          description: 'folder for ' + path,
          item: []
        };
        for(var method in project.paths[path]){
          var item = this.getPostmanItem(path, method, project.paths[path][method]);
          folder.item.push(item);
        }
        items.push(folder);
      }
    }
    return items;
  }

  getPostmanItem(path:string, method:string, endpoint:Path):{}{
    var url = "{{baseUrl}}" + path;
    var body = undefined;
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
        if(url.indexOf("?") == 0){
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

  getPostmanBase(): {} {
    var collection = {
      info: {
        name: Config.get('application-name'),
        version: Config.get('application-version').toString(),
        description: Config.get('application-description'),
        schema: "https://schema.getpostman.com/json/collection/v2.0.0/collection.json"
      },
      item: []
    };

    // get base url
    var schema = Config.get('application-schema');
    var host = Config.get('application-host');
    var basePath = Config.get('application-basePath');
    var host = "localhost:8080";
    while (basePath.indexOf('/') == 0) {
      basePath = basePath.substr(1);
    }

    var baseUrl = schema + "://" + host + "/" + basePath;
    collection['variable'] = [
      {
        id: 'baseUrl',
        type: 'string',
        value: baseUrl
      }
    ];


    return collection;
  }

}