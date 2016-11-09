import { Pipe } from "../pipe";
import { ProjectTree } from "@maxxton/microdocs-core/domain/tree/project-tree.model";
import { buildTree } from "../func/tree.func";

/**
 * Pipe to generate a project tree as result
 * @author Steven Hermans
 */
export class TreePipe extends Pipe<ProjectTree>{

  protected run():ProjectTree {
    return buildTree(this);
  }

}