
import {ProjectRepository} from '../repositories/project.repo';
import {SchemaHelper} from "@maxxton/microdocs-core/helpers/schema/schema.helper";
import {ProjectTree, Project} from "@maxxton/microdocs-core/domain";
import { PostmanService } from "./postman.service";

export class ProjectService{

  constructor(private projectRepo:ProjectRepository){}

  public storeAggregatedProjects(env:string, projectTree:ProjectTree) : void{
    this.projectRepo.storeAggregatedProjects(env, projectTree);
  }

  public storeAggregatedProject(env:string, project:Project) : void{
    this.addResponseExamples(project);

    this.projectRepo.storeAggregatedProject(env, project);
  }

  private addResponseExamples(project:Project){
    project.swagger = "2.0";
    if(project.paths != undefined){
      for(var path in project.paths){
        for(var method in project.paths[path]){
          var endpoint = project.paths[path][method];
          if(endpoint.responses != undefined && endpoint.responses['default'] != undefined && endpoint.responses['default'].schema != undefined){
            var response = endpoint.responses['default'];
            var schema = response.schema;
            var example = SchemaHelper.generateExample(schema, undefined, [], project);
            schema.default = example;
          }
        }
      }
    }
  }


}