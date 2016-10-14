
import {Project} from "../domain/project.model";
import {Builder} from "./builder";
import {DependencyBuilder} from "./dependency.builder";
import {ComponentBuilder} from "./component.builder";
import {PathBuilder} from "./path.builder";
import {ControllerBuilder} from "./controller.builder";

export class ProjectBuilder implements Builder<Project>{

  private _project:Project = {};
  public project():Project {
    get: {
      return this._project;
    }
  }

  build(): Project {
    return this._project;
  }

  dependency(dependencyBuilder:DependencyBuilder):void{
    if(!dependencyBuilder.title || dependencyBuilder.title == ''){
      throw new Error("No title found for client");
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
      throw new Error("No title found for component");
    }
    this._project.components[componentBuilder.title] = componentBuilder.build();
  }
  
  controller(controllerBuilder:ControllerBuilder):void{
    controllerBuilder.build().forEach(pathBuilder => {
      this.path(pathBuilder);
    });
  }
  
  path(pathBuilder:PathBuilder):void{
    // if(!componentBuilder.title || componentBuilder.title == ''){
    //   throw new Error("No title found for component");
    // }
    // this._project.components[componentBuilder.title] = componentBuilder.build();
  }

}