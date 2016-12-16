import { Problem, RawProblem, Problemable, Component, Method, Project } from "../../domain";

export class ProblemReporter {

  private problems: RawProblem[] = [];

  constructor(private rootObject?: {}) {
  }

  public report(level: string, description: string, component?: Component, method?: Method, clientRootObject?: {}, clientTitle?: string, clientVersion?: string, clientComponent?: Component, clientMethod?: Method) {
    let rawProblem = new RawProblem(level, description, this.rootObject, component, method, clientRootObject, clientTitle, clientVersion, clientComponent, clientMethod);
    this.problems.push(rawProblem);
  }

  /**
   * Check if there are problems
   * @param levels problem level to filter on
   * @return {boolean}
   */
  public hasProblems(...levels:string[]): boolean {
    return this.problems.filter(problem => {
          if(levels && levels.length > 0){
            return levels.indexOf(problem.level) != -1;
          }
          return true;
    }).length > 0;
  }

  /**
   * Publish the problem report to the corresponding object and increase the problem count
   * @param object corresponding object
   * @param project object which holds the problemCount
   */
  public publish(object: Problemable, project: Project, problems:Problem[] = this.getProblems()): void {
    if (!object.problems) {
      object.problems = [];
    }
    problems.forEach(problem => object.problems.push(problem));

    if (project.problemCount == undefined || project.problemCount == null) {
      project.problemCount = this.problems.length;
    } else {
      project.problemCount += this.problems.length;
    }
  }

  public getProblems(): Problem[] {
    return this.problems.map(rawProblem => rawProblem.problem);
  }

  public getRawProblems(): RawProblem[] {
    return this.problems;
  }

}