import { ProcessPipe } from "./process.pipe";
import { Project } from "@maxxton/microdocs-core/domain/project.model";
import { resolveRestDependencies } from "../func";
import { AggregationPipeline } from "../aggregation-pipeline";
/**
 * @author Steven Hermans
 */
export class RestDependenciesPipe extends ProcessPipe{

  private _scope:Project;

  constructor(pipeline:AggregationPipeline, scope?:Project){
    super(pipeline);
    this._scope = scope;
  }

  protected runEach( project:Project ):Project {
    resolveRestDependencies(this, project, this._scope);
    return project;
  }

}