
import {ProjectRepository} from '../repositories/project.repo';
import {ProjectJsonRepository} from '../repositories/json/project-json.repo';
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";
import {TreeNode, Project, Schema, ProjectInfo} from "microdocs-core-ts/dist/domain";
import {Config} from "../config";

export class ProjectService{

  private projectRepo:ProjectRepository;

  constructor(){
    this.projectRepo = ProjectJsonRepository.bootstrap();
  }

  public static bootstrap():ProjectService {
    return new ProjectService();
  }

  public storeAggregatedProjects(node:TreeNode) : void{
    this.projectRepo.storeAggregatedProjects(node);
  }

  public storeAggregatedProject(project:Project) : void{
    this.addResponseExamples(project);

    this.projectRepo.storeAggregatedProject(project);
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