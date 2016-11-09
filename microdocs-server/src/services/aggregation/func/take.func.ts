import { AggregationPipeline } from "./../aggregation-pipeline";
import { Pipe } from "../pipe";

/**
 * Add all stored reports as input for the pipeline
 * @param pipe
 * @return {AggregationPipeline}
 */
export function takeEverything(pipe:Pipe){
  pipe.projects.forEach( projectInfo => {
    projectInfo.versions.forEach(version => {
      projectInfo.version = version;
      let report = pipe.reportRepo.getProject(pipe.env, projectInfo);
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
export function takeLatest(pipe:Pipe, versionAmount:number):void{
  pipe.projects.forEach(projectInfo => {
    var latestVersions = projectInfo.versions.reverse().slice(0, versionAmount);
    latestVersions.forEach(version => {
      projectInfo.version = version;
      let report = pipe.reportRepo.getProject(pipe.env, projectInfo);
      pipe.result.pushProject(report);
    })
  });
}

