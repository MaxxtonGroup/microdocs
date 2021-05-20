import { Pipe } from "../pipe";
import { buildTree } from "../funcs/tree.func";
/**
 * @author Steven Hermans
 */
export class StoreIndexPipe extends Pipe<any> {

  protected run(): Pipe<any> {
    const projectTree = buildTree(this);
    this.projectService.storeAggregatedProjects(this.env, projectTree);

    this.prev && this.prev.result.projectList.forEach(project => this.result.pushProject(project));

    return this;
  }

}
