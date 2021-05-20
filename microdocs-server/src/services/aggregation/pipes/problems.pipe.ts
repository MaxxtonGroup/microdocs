import { Problem } from "@maxxton/microdocs-core/dist/domain/problem/problem.model";
import { Pipe } from "../pipe";
/**
 * @author Steven Hermans
 */
export class ProblemsPipe extends Pipe<Problem[]> {

  protected run():Problem[] {
    this.forwardResult();
    return this.pipeline.problems;
  }

}