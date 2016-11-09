import { Problem } from "@maxxton/microdocs-core/domain/problem/problem.model";
import { Pipe } from "../pipe";
/**
 * @author Steven Hermans
 */
export class ProblemsPipe extends Pipe<Problem[]> {

  protected run():Problem[] {
    return this.pipeline.problems;
  }

}