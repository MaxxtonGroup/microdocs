
import { PreProcessor } from "@maxxton/microdocs-core/pre-processor/pre-processor";
import { ProjectSettings,Project} from "@maxxton/microdocs-core/domain";
import { Environment } from "../../domain/environment.model";

/**
 * PreProcess a report based on the project settings
 * @param env
 * @param preProcessor
 * @param report project to be processed
 * @return {Project}
 */
export function preProcess(env:Environment, preProcessor:PreProcessor, report:Project, settings:ProjectSettings):Project{
  return preProcessor.processProject(settings, report, env.name);
}