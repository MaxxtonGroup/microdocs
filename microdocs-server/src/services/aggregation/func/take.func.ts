import { AggregationPipeline } from "./../aggregation-pipeline";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { ReportRepository } from "../../../repositories/report.repo";
import { preProcess } from "./pre-process.func";

/**
 * Add report as input for the pipeline
 * @param pipeline
 * @param report
 * @return {AggregationPipeline}
 */
export function take(pipeline:AggregationPipeline, report:Project):AggregationPipeline{
  let processedReport = preProcess(pipeline, report)
  pipeline.getResult().push(report);
  return pipeline;
}

/**
 * Add all stored reports as input for the pipeline
 * @param pipeline
 * @param reportRepository
 * @return {AggregationPipeline}
 */
export function takeEverything(pipeline:AggregationPipeline):AggregationPipeline{
  var projects = pipeline.getReportRepository().getProjects(pipeline.getEnv());
  projects.forEach(projectInfo => {
    projectInfo.versions.forEach(version => {
      projectInfo.version = version;
      let report = pipeline.getReportRepository().getProject(pipeline.getEnv(), projectInfo);
      take(pipeline, report);
    })
  });
  return pipeline;
}

/**
 * Add latest version(s) stored reports as input for the pipeline
 * @param pipeline
 * @param reportRepository
 * @param maxAmount amount of versions per project
 * @return {AggregationPipeline}
 */
export function takeLatest(pipeline:AggregationPipeline, maxAmount:number):AggregationPipeline{
  var projects = pipeline.getReportRepository().getProjects(pipeline.getEnv());
  projects.forEach(projectInfo => {
    projectInfo.versions.forEach(version => {
      projectInfo.version = version;
      let report = pipeline.getReportRepository().getProject(pipeline.getEnv(), projectInfo);
      take(pipeline, report);
    })
  });
  return pipeline;
}

