
import { AggregationPipeline } from "../aggregation-pipeline";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { PreProcessor } from "@maxxton/microdocs-core/pre-processor/pre-processor";

/**
 * PreProcess a report based on the project settings
 * @param pipeline
 * @param preProcessor
 * @param report project to be processed
 * @return {Project}
 */
export function preProcess(pipeline:AggregationPipeline, preProcessor:PreProcessor, report:Project):Project{
  return preProcessor.processProject(pipeline.projectSettingsRepo, report, pipeline.env);
}