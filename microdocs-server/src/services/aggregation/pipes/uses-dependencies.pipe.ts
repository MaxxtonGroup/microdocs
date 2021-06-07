import { ProcessPipe } from "./process.pipe";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { resolveUsesDependencies } from "../funcs";
import { AggregationPipeline } from "../aggregation-pipeline";
/**
 * @author Steven Hermans
 */
export class UsesDependenciesPipe extends ProcessPipe {

  private _scope: Project;

  constructor(pipeline: AggregationPipeline, scope?: Project) {
    super(pipeline);
    this._scope = scope;
  }

  protected runEach( project: Project ): Project {
    resolveUsesDependencies(this, project, this._scope);
    return project;
  }

}
