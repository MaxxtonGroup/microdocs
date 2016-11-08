
import { AggregationPipeline } from "../aggregation-pipeline";
import { Project } from "@maxxton/microdocs-core/domain/project.model";

/**
 * PreProcess a report based on the project settings
 * @param pipeline
 * @param projectSettingsRepository
 * @param report project to be processed
 * @return {Project}
 */
export function preProcess(pipeline:AggregationPipeline, report:Project):Project{
  if(pipeline.getPreProcessor()){
    return pipeline.getPreProcessor().processProject(pipeline.getProjectSettingsRepository(), report, pipeline.getEnv());
  }
  return report;
}