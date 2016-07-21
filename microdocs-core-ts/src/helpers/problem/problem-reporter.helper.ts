import {Problem} from "../../domain/problem/problem.model";
import {Component} from "../../domain/component/component.model";
import {SchemaHelper} from "../schema/schema.helper";
import {Method} from "../../domain/component/method.model";

export class ProblemReporter {

  private problems:Problem[] = [];

  constructor(private rootObject?:{}){}

  public report(level:string, description:string, component?:Component, method?:Method) {
    var problem:Problem = {level: level, message: description};

    if(component != undefined){
      component = SchemaHelper.resolveObject(component, this.rootObject);
    }
    if(component != null){
      problem.package = component.name;
      problem.className = component['_id'];
    }

    if(method != undefined){
      method = SchemaHelper.resolveObject(method, this.rootObject);
    }
    if(method != null){
      problem.lineNumber = method.lineNumber;
    }

    this.problems.push(problem);
  }

  public hasProblems():boolean {
    return this.problems.length > 0;
  }

  /**
   * Publish the problem report to the corresponding object and increase the problem count
   * @param object corresponding object
   * @param project object which holds the problemCount
   */
  public publish(object:{'problems':Problem[]}, project:{'problemCount':number}):void {
    if (object.problems == undefined || object.problems == null) {
      object.problems = [];
    }
    this.problems.forEach(problem => object.problems.push(problem));
    if(project.problemCount == undefined || project.problemCount == null){
      project.problemCount = this.problems.length;
    }else{
      project.problemCount += this.problems.length;
    }
  }

}