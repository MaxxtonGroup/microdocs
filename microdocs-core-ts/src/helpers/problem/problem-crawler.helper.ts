import {Problem, Project} from "../../domain";
import {Path} from "../../domain/path/path.model";
import {Dependency} from "../../domain/dependency/dependency.model";

export function getProblemsInProject(project:Project):Problem[] {
  var problems:Problem[] = [];

  //crawl project
  if (project.problems != undefined && project.problems != null) {
    project.problems.forEach(problem => problems.push(problem));
  }
  //crawl endpoint
  if (project.paths != undefined && project.paths != undefined) {
    getProblemsInPaths(project.paths).forEach(problem => problems.push(problem));
  }

  //crawl dependencies
  if (project.dependencies != undefined && project.dependencies != undefined) {
    for (var title in project.dependencies) {
      var dependency = project.dependencies[title];
      getProblemsInDependency(dependency).forEach(problem => problems.push(problem));
    }
  }

  //crawl components
  if (project.components != undefined && project.components != undefined) {
    for (var name in project.components) {
      var component = project.components[name];
      if (component.problems != undefined && component.problems != null) {
        component.problems.forEach(problem => problems.push(problem));
      }
    }
  }

  return problems;
}

export function getProblemsInDependency(dependency:Dependency):Problem[]{
  var problems:Problem[] = [];
  if (dependency.problems != undefined && dependency.problems != null) {
    dependency.problems.forEach(problem => problems.push(problem));
  }
  if (dependency.paths != undefined && dependency.paths != undefined) {
    getProblemsInPaths(dependency.paths).forEach(problem => problems.push(problem));
  }
  return problems;
}

export function getProblemsInPaths(paths:{[key:string]:{[key:string]:Path}}):Problem[]{
  var problems:Problem[] = [];
  for (var path in paths) {
    for (var method in paths[path]) {
      var endpoint = paths[path][method];
      if (endpoint.problems != undefined && endpoint.problems != null) {
        endpoint.problems.forEach(problem => problems.push(problem));
      }
    }
  }
  return problems;
}