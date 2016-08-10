import {Project, Schema, Path, ProjectInfo, TreeNode} from "microdocs-core-ts/dist/domain";
import * as express from "express";
import {MicroDocsResponseHandler} from "./microdocs-response.handler";
import {Config} from "../../config";

export class PostmanResponseHandler extends MicroDocsResponseHandler {

  handleProjects(req: express.Request, res: express.Response, projects: TreeNode) {
    var project = this.mergeProjects(projects);

    this.response(req, res, 200, this.postman(project));
  }

  handleProject(req: express.Request, res: express.Response, project: Project) {
    this.response(req, res, 200, this.postman([project]));
  }

  postman(project: Project): {} {
    var collection = this.getPostmanBase();
    collection['item'] = this.getPostmanItems(project);

    return collection;
  }

  getPostmanItems(project: Project): {}[] {
    var items = [];
    if (project.paths != undefined) {
      var paths = Object.keys(project.paths);
      if (paths.length > 0) {

        //find base path
        var basePath = "";
        var sectionIndex = 0;
        var firstPath = paths[0];
        var sections = firstPath.split("/");
        for (var i = 0; i < sections.length; i++) {
          var section = sections[i];
          var newBasePath = basePath + "/" + section;
          if (newBasePath.indexOf("//") == 0) {
            newBasePath = newBasePath.substring(1);
          }
          if (paths.filter(path => path.indexOf(newBasePath) != 0).length > 0) {
            basePath = newBasePath;
            sectionIndex = i + 1;
          } else {
            break;
          }
        }

        //create folders
        paths.forEach(path => {
          var pathSections = path.split("/");
          if(pathSections.length > sectionIndex){
            var name = pathSections[sectionIndex];
            if(items.filter(i => i['name'] == name).length == 0){
              items.push({
                name: name,
                description: 'Folder for ' + name,
                item: []
              });
            }
            for(var method in project.paths[path]){
              var item = this.getPostmanItem(path, method, project.paths[path][method]);
              items.filter(i => i['name'] == name)[0].item.push(item);
            }
          }else{
            for(var method in project.paths[path]){
              var item = this.getPostmanItem(path, method, project.paths[path][method]);
              items.push(item);
            }
          }
        });

      }
    }
    return items;
  }

  getPostmanItem(path:string, method:string, endpoint:Path):{}{
    return {
      name: path,
      request: {
        url: "{{baseUrl}}" + path,
        method: method.toUpperCase(),

      }
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
        id: 'basePath',
        type: 'string',
        value: baseUrl
      }
    ];


    return collection;
  }

}