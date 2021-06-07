import { ProcessPipe } from "./process.pipe";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { combineIncludes } from "../funcs";
/**
 * @author Steven Hermans
 */
export class IncludesPipe extends ProcessPipe {

  protected runEach( project: Project ): Project {
    combineIncludes(this, project);
    return project;
  }

}
