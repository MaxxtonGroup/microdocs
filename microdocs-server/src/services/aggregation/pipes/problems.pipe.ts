import { Problem } from "@maxxton/microdocs-core/domain/problem/problem.model";
import { Pipe } from "../pipe";
/**
 * @author Steven Hermans
 */
export class ProblemsPipe extends Pipe<Array<Problem>> {

  protected run(): Array<Problem> {
    this.forwardResult();
    return this.pipeline.problems;
  }

}
