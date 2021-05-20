import { Pipe } from "../pipe";
import { ProjectTree } from "@maxxton/microdocs-core/dist/domain/tree/project-tree.model";
import { buildTree } from "../funcs/tree.func";
import { AggregationPipeline } from "../aggregation-pipeline";

/**
 * Pipe to generate a project tree as result
 * @author Steven Hermans
 */
export class TreePipe extends Pipe<ProjectTree> {

  constructor( pipeline: AggregationPipeline ) {
    super(pipeline);
  }

  protected run(): ProjectTree {
    this.forwardResult();
    return buildTree(this);
  }

}
