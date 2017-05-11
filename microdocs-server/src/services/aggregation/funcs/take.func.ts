import { AggregationPipeline } from "./../aggregation-pipeline";
import { Pipe } from "../pipe";
import { ProjectInfo } from "@maxxton/microdocs-core/domain/common/project-info.model";

/**
 * Add all stored reports as input for the pipeline
 * @param pipe
 * @return {AggregationPipeline}
 */
export function takeEverything(pipe:Pipe<any>){
  pipe.projects.forEach( (projectInfo:ProjectInfo) => {
    projectInfo.getVersions().forEach((version:string) => {
      let info = projectInfo.getVersion(version);
      let report = pipe.reportRepo.getProject(pipe.env, info);
      pipe.result.pushProject(report);
    })
  });
}

/**
 * Add latest version(s) stored reports as input for the pipeline
 * @param pipe
 * @param versionAmount amount of versions per project
 * @return {AggregationPipeline}
 */
export function takeLatest(pipe:Pipe<any>, versionAmount:number):void{
  pipe.projects.forEach((projectInfo:ProjectInfo) => {
    var latestVersions = projectInfo.getVersions().reverse().slice(0, versionAmount);
    latestVersions.forEach((version:string) => {
      let info = projectInfo.getVersion(version);
      let report = pipe.reportRepo.getProject(pipe.env, info);
      pipe.result.pushProject(report);
    })
  });
}

