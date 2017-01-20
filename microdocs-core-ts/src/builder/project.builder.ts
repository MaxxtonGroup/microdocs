
import {Project} from "../domain/project.model";
import {Builder} from "./builder";
import {DependencyBuilder} from "./dependency.builder";
import {ComponentBuilder} from "./component.builder";
import {PathBuilder} from "./path.builder";
import {ControllerBuilder} from "./controller.builder";
import {Schema} from "../domain/schema/schema.model";

export class ProjectBuilder implements Builder<Project>{

  private _project:Project = {};
  public project():Project {
    return this._project;
  }

  build(): Project {
    return this._project;
  }

  dependency(dependencyBuilder:DependencyBuilder):void{
    if(!dependencyBuilder.title || dependencyBuilder.title == ''){
      console.error("No title found for client");
    }
    if(!this._project.dependencies){
      this._project.dependencies = {};
    }
    if(this._project.dependencies[dependencyBuilder.title]){
      //merge two dependencies
      var dep1 = this._project.dependencies[dependencyBuilder.title];
      var dep2 = dependencyBuilder.build();
      if(!dep1.description && dep2.description){
        dep1.description = dep2.description;
      }
      if(!dep1.paths && dep2.paths){
        dep1.paths = dep2.paths;
      }else{
        for(var path in dep2.paths){
          if(!dep1.paths[path]){
            dep1.paths[path] = dep2.paths[path];
          }else{
            for(var method in dep2.paths[path]){
              dep1.paths[path][method] = dep2.paths[path][method];
            }
          }
        }
      }
    }else{
      this._project.dependencies[dependencyBuilder.title] = dependencyBuilder.build();
    }
  }
  
  component(componentBuilder:ComponentBuilder):void{
    if(!componentBuilder.title || componentBuilder.title == ''){
      console.error("No title found for component");
    }
    if(!this._project.components){
      this._project.components = {};
    }
    this._project.components[componentBuilder.title] = componentBuilder.build();
  }
  
  controller(controllerBuilder:ControllerBuilder):void{
    controllerBuilder.build().forEach(pathBuilder => {
      this.path(pathBuilder, controllerBuilder.baseUrl, controllerBuilder.requestMethods);
    });
  }

  path(pathBuilder:PathBuilder, basePath:string='', requestMethods:string[]=[]):void{
    var path = basePath + pathBuilder.path;
    var requestMethods = pathBuilder.methods.concat(requestMethods).map(method => method.toLowerCase());
    if(!path || path == ''){
      console.error("No path found for endpoint");
    }
    if(!requestMethods || requestMethods.length == 0){
      console.error("No request methods found for endpoint");
    }

    if(!this._project.paths){
      this._project.paths = {};
    }
    if(!this._project.paths[path]){
      this._project.paths[path] = {};
    }
    requestMethods.forEach(method => {
      this._project.paths[pathBuilder.path][method] = pathBuilder.build();
    });
  }

  model(schema:Schema):void {
    if (!schema.name || schema.name == '') {
      console.error("No name found for schema");
    }
    if (!this._project.definitions) {
      this._project.definitions = {};
    }
    this._project.definitions[schema.name] = schema;
  }

}