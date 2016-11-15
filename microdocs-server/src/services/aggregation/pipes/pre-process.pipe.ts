import { ProcessPipe } from "./process.pipe";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { PreProcessor } from "@maxxton/microdocs-core/pre-processor/pre-processor";
import { MicroDocsPreProcessor } from "@maxxton/microdocs-core/pre-processor/microdocs.pre-processor";
import { preProcess } from "../funcs/pre-process.func";
/**
 * @author Steven Hermans
 */
export class PreProcessPipe extends ProcessPipe {

  private preProcessor:PreProcessor = new MicroDocsPreProcessor();

  protected runEach( project:Project ):Project {
    return preProcess(this.pipeline, this.preProcessor, project);
  }


}