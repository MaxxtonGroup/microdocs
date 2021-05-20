import { ProcessPipe } from "./process.pipe";
import { Project } from "@maxxton/microdocs-core/dist/domain/project.model";
/**
 * @author Steven Hermans
 */
export class StoreProjectsPipe extends ProcessPipe {

  protected runEach( project:Project ):Project {
    this.projectService.storeAggregatedProject(this.env, project);
    return project;
  }

}