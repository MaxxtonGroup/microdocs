import { AggregationPipeline } from "../aggregation-pipeline";
import { DependencyTypes, Dependency } from "@maxxton/microdocs-core/domain";

export function combineIncludes( pipeline:AggregationPipeline):AggregationPipeline{
  for(var i = 0; i < pipeline.getResult().projectList.length; i++){
    let project = pipeline.getResult().projectList[i];
    if(project.dependencies){
      for(var depTitle in project.dependencies){
        var dependency = project.dependencies[depTitle];
        if(dependency.type === DependencyTypes.INCLUDES){

        }
      }
    }
  }
  return pipeline;
}

export function includeProject(pipeline:AggregationPipeline, dependency:Dependency){
  let version = dependency.version;
  if(!version){
    let versions = pipeline.getResult().getProjectVersions(version);
    versions.sort()
  }
}