import {Problem, ProblemClient} from "../../domain/problem/problem.model";
import {Component} from "../../domain/component/component.model";
import {SchemaHelper} from "../schema/schema.helper";
import {Method} from "../../domain/component/method.model";

export class ProblemReporter {

  private problems: Problem[] = [];

  constructor(private rootObject?: {}) {
  }

  public report(level: string, description: string, component?: Component, method?: Method, clientRootObject?: {}, clientTitle?: string, clientVersion?: string, clientComponent?: Component, clientMethod?: Method) {
    console.warn(level + ": " + description);
    var problem: Problem = {level: level, message: description};

    // log component info
    if (component != undefined) {
      component = SchemaHelper.resolveObject(component, this.rootObject);
      if (component != null && component != undefined && component.name != undefined && component.name != null) {
        problem.path = component.file;
        var fullName = component.name;
        var segments = fullName.split('.');
        if (segments.length > 0) {
          problem.package = fullName.substring(0, fullName.length - segments[segments.length - 1].length - 1);
          problem.className = segments[segments.length - 1];
        }
      }
    }

    // log method info
    if (method != undefined) {
      method = SchemaHelper.resolveObject(method, this.rootObject);
    }
    if (method != null) {
      problem.lineNumber = method.lineNumber;
    }

    // log client info
    if (clientRootObject != undefined && clientTitle != undefined) {
      var client: ProblemClient = {title:clientTitle, version: clientVersion};
      client.title = clientTitle;
      client.version = clientVersion;

      // log client component info
      if (clientComponent != undefined) {
        clientComponent = SchemaHelper.resolveObject(clientComponent, clientRootObject);
        if (clientComponent != null && clientComponent != undefined && clientComponent.name != undefined && clientComponent.name != null) {
          client.path = clientComponent.file;
          var fullName = clientComponent.name;
          var segments = fullName.split('.');
          if (segments.length > 0) {
            client.package = fullName.substring(0, fullName.length - segments[segments.length - 1].length - 1);
            client.className = segments[segments.length - 1];
          }
        }
      }

      // log client method info
      if (clientMethod != undefined) {
        clientMethod = SchemaHelper.resolveObject(clientMethod, clientRootObject);
      }
      if (clientMethod != null) {
        client.lineNumber = clientMethod.lineNumber;
        if(clientMethod['sourceLink']){
          client.sourceLink = clientMethod['sourceLink'];
        }
      }

      problem.client = client;
    }

    this.problems.push(problem);
  }

  public hasProblems(): boolean {
    return this.problems.length > 0;
  }

  /**
   * Publish the problem report to the corresponding object and increase the problem count
   * @param object corresponding object
   * @param project object which holds the problemCount
   */
  public publish(object: {'problems': Problem[]}, project: {'problemCount': number}): void {
    if (!object.problems) {
      object.problems = [];
    }
    this.problems.forEach(problem => object.problems.push(problem));

    if (project.problemCount == undefined || project.problemCount == null) {
      project.problemCount = this.problems.length;
    } else {
      project.problemCount += this.problems.length;
    }
  }

  public getProblems(): Problem[] {
    return this.problems;
  }

}