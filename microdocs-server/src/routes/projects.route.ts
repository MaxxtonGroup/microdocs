
import * as express from "express";

import {BaseRoute} from "./route";
import {ProjectTree, ProjectNode, DependencyNode} from '@maxxton/microdocs-core/dist/domain';
import {ProjectRepository} from "../repositories/project.repo";

/**
 * @controller
 */
export class ProjectsRoute extends BaseRoute {

  mapping = {methods: ['get'], path: '/projects', handler: this.projects};

  /**
   * @httpGet /api/v1/projects
   * @httpQuery ?env {string}
   * @httpQuery ?groups {string[]} filter to include or exclude groups with a '!' in front
   * @httpQuery ?projects {string[]} filter to include or exclude groups with a '!' in front
   * @httpResponse 200 {TreeNode}
   */
  public projects(req: express.Request, res: express.Response, next: express.NextFunction, scope: BaseRoute) {
    let handler = scope.getHandler(req);
    console.info("handler: " + handler);
    try {
      let env = scope.getEnv(req, scope);
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }

      let rootNode = scope.injection.ProjectRepository().getAggregatedProjects(env);
      if (rootNode == null) {
        rootNode = new ProjectTree();
      }

      let groups: Array<string> = [];
      let titles: Array<string> = [];
      if (req.query.groups != undefined) {
        groups = (req.query.groups as string).split(',');
      }
      if (req.query.projects != undefined) {
        titles = (req.query.projects as string).split(',');
      }
      rootNode = filterRoot(rootNode, groups, titles);

      handler.handleProjects(req, res, rootNode, env, scope.injection);
    } catch (e) {
      scope.getDefaultHandler().handleInternalServerError(req, res, e);
    }
  }
}

function filterRoot(root: ProjectTree, groups: Array<string>, projects: Array<string>): ProjectTree {
  let removeProjects: Array<ProjectNode> = [];
  root.projects.forEach(project => {
    if (filterProject(project, groups, projects)) {
      removeProjects.push(project);
    } else {
      filterProjects(project, groups, projects);
    }
  });
  removeProjects.forEach(project => delete root.projects[root.projects.indexOf(project)]);

  return root;
}

function filterProjects(projectNode: ProjectNode, groups: Array<string>, projects: Array<string>): ProjectNode {
  let removeDependency: Array<DependencyNode> = [];
  projectNode.dependencies.forEach(dependency => {
    if (filterProject(dependency.item, groups, projects)) {
      removeDependency.push(dependency);
    } else {
      filterProject(dependency.item, groups, projects);
    }
  });
  removeDependency.forEach(dependency => delete projectNode.dependencies[projectNode.dependencies.indexOf(dependency)]);

  return projectNode;
}

function filterProject(project: ProjectNode, groups: Array<string>, projects: Array<string>): boolean {
  let filter = false;

  // filter project
  projects.forEach(fTitle => {
    if (fTitle.indexOf('!') == 0) {
      // ignore
      fTitle = fTitle.substring(1);
      if (project.title == fTitle) {
        filter = true;
      }
    } else {
      // select
      if (project.title != fTitle) {
        filter = true;
      }
    }
  });

  // filter groups
  groups.forEach(group => {
    if (group.indexOf('!') == 0) {
      // ignore
      group = group.substring(1);
      if (project.group == group) {
        filter = true;
      }
    } else {
      // select
      if (project.group != group) {
        filter = true;
      }
    }
  });
  return filter;
}
