
import { AggregationPipeline } from "../aggregation-pipeline";
import { PreProcessor } from "@maxxton/microdocs-core/pre-processor/pre-processor";
import { ProjectSettings, Project} from "@maxxton/microdocs-core/domain";

/**
 * PreProcess a report based on the project settings
 * @param pipeline
 * @param preProcessor
 * @param report project to be processed
 * @return {Project}
 */
export function preProcess(pipeline: AggregationPipeline, preProcessor: PreProcessor, report: Project, settings: ProjectSettings): Project {
  return preProcessor.processProject(settings, report, pipeline.env);
}
