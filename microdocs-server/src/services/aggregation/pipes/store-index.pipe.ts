import { Pipe } from "../pipe";
import { buildTree } from "../funcs/tree.func";
/**
 * @author Steven Hermans
 */
export class StoreIndexPipe extends Pipe<any>{

  protected run():Pipe<any> {
    let projectTree = buildTree(this);
    this.projectService.storeAggregatedProjects(this.env, projectTree);
    return this;
  }

}