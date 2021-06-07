
import * as express from "express";

import {BaseRoute} from "./route";
import {SchemaHelper} from "@maxxton/microdocs-core/helpers";
import {ProjectChangeRule, Project, ProjectInfo} from '@maxxton/microdocs-core/domain';
import {ReportRepository} from "../repositories/report.repo";
import {ProjectRepository} from "../repositories/project.repo";

/**
 * @controller
 */
export class EditProjectRoute extends BaseRoute {

  mapping = {methods: ['patch'], path: '/projects/:title', handler: this.editProject};

  /**
   * Update reports
   * @httpPatch /api/v1/projects/:title
   * @httpPath title {string} name of the report
   * @httpQuery version {string} version of the report
   * @httpQuery ?env {string} environment to check the project definition against
   * @httpBody {ProjectChangeRule[]} Rules to alter project(s)
   * @httpResponse 200 {Project} Updated project
   * @httpResponse 404
   */
  public editProject(req: express.Request, res: express.Response, next: express.NextFunction, scope: BaseRoute) {
    const handler = scope.getHandler(req);
    const env = scope.getEnv(req, scope);
    try {
      if (env == null) {
        handler.handleBadRequest(req, res, "env '" + req.query.env + "' doesn't exists");
        return;
      }

      const title = req.params.title as string;
      const version = req.query.version as string;

      if (!version || version.trim() === '') {
        handler.handleBadRequest(req, res, "Missing 'version' param");
        return;
      }

      // find project
      const reportRepository = scope.injection.ReportRepository();
      const projectRepository = scope.injection.ProjectRepository();
      const projects = reportRepository.getProjects(env);
      const matches = projects.filter(info => info.title.toLowerCase() === title.toLowerCase() && info.getVersions().indexOf(version) != -1).map(info => {
        info.version = version;
        return info;
      });
      if (matches.length == 0 || !matches[0]) {
        handler.handleNotFound(req, res, "Project '" + title + ":" + version + " doesn't exists");
      }
      const report = reportRepository.getProject(env, matches[0]);
      if (!report) {
        handler.handleNotFound(req, res, "Project '" + title + ":" + version + " cannot be found");
      }

      // Check body
      if (!req.body || !Array.isArray(req.body)) {
        handler.handleBadRequest(req, res, "missing request body");
        return;
      }

      const errors: Array<string> = [];
      const rules: Array<ProjectChangeRule> = [];
      for (let i = 0; i < req.body.length; i++) {
        const item = req.body[i];
        if (!item['key'] || item['key'].trim() === '') {
          errors.push("Missing 'key' at item " + i);
        } else if (!item['type']) {
          errors.push("Missing 'type' at item " + i);
        } else if (item['type'] !== ProjectChangeRule.TYPE_ALTER && item['type'] !== ProjectChangeRule.TYPE_DELETE) {
          errors.push("Unknown 'type' at item " + i + ", expected: " + ProjectChangeRule.TYPE_ALTER + " or " + ProjectChangeRule.TYPE_DELETE);
        } else if (item['scope'] && item['scope'] !== ProjectChangeRule.SCOPE_VERSION && item['scope'] !== ProjectChangeRule.SCOPE_PROJECT && item['scope'] !== ProjectChangeRule.SCOPE_GROUP) {
          errors.push("Unknown 'scope' at item " + i + ", expected: " + ProjectChangeRule.SCOPE_VERSION + ", " + ProjectChangeRule.SCOPE_PROJECT + " or " + ProjectChangeRule.SCOPE_GROUP);
        } else if (item['type'] == ProjectChangeRule.TYPE_ALTER && item['value'] === undefined) {
          errors.push("Missing 'value' at item " + i);
        } else {
          rules.push(new ProjectChangeRule(item['key'], item['type'], item['value'], item['scope'] ? item['scope'] : ProjectChangeRule.SCOPE_VERSION));
        }
      }
      if (errors.length > 0) {
        handler.handleBadRequest(req, res, JSON.stringify(errors));
        return;
      }
      if (rules.length == 0) {
        handler.handleBadRequest(req, res, "Empty request body");
        return;
      }

      // 1. update current version
      updateVersion(report, matches[0], rules, reportRepository, projectRepository, env);

      // 2. update current project
      const projectRules = rules.filter(rule => rule.scope === ProjectChangeRule.SCOPE_PROJECT || rule.scope === ProjectChangeRule.SCOPE_GROUP);
      if (projectRules.length > 0) {
        updateProject(matches[0], version, projectRules, reportRepository, projectRepository, env);
      }

      // 3. update current group
      const groupRules = rules.filter(rule => rule.scope === ProjectChangeRule.SCOPE_GROUP);
      if (groupRules.length > 0) {
        updateGroup(projects.filter(projectInfo => projectInfo.group.toLowerCase() === matches[0].group.toLowerCase()), title, projectRules, reportRepository, projectRepository, env);
      }

      scope.injection.AggregationService().reindex(env);
      const project = projectRepository.getAggregatedProject(env, report.info ? report.info.title : title, report.info ? report.info.version : version);
      handler.handleProject(req, res, project, env, scope.injection);

    } catch (e) {
      // Make sure to reindex, some aggregated project may have already been cleaned up
      scope.injection.AggregationService().reindex(env);

      scope.getDefaultHandler().handleInternalServerError(req, res, e);
    }
  }
}

function updateGroup(infos: Array<ProjectInfo>, ignoreProject: string, rules: Array<ProjectChangeRule>, reportRepository: ReportRepository, projectRepository: ProjectRepository, env: string) {
  infos.filter(info => info.title.toLowerCase() !== ignoreProject.toLowerCase()).forEach(projectInfo => {
    updateProject(projectInfo, '', rules, reportRepository, projectRepository, env);
  });
}

function updateProject(info: ProjectInfo, ignoreVersion: string, rules: Array<ProjectChangeRule>, reportRepository: ReportRepository, projectRepository: ProjectRepository, env: string) {
  info.getVersions().filter(v => v !== ignoreVersion).forEach(version => {
    const vInfo = new ProjectInfo(info.title, info.group, version, info.getVersions());
    const report = reportRepository.getProject(env, vInfo);
    if (report) {
      updateVersion(report, vInfo, rules, reportRepository, projectRepository, env);
    } else {
      reportRepository.removeProject(env, info);
    }
  });
}

function updateVersion(report: Project, info: ProjectInfo, rules: Array<ProjectChangeRule>, reportRepository: ReportRepository, projectRepository: ProjectRepository, env: string) {
  rules.forEach(rule => {
    if (rule.type === ProjectChangeRule.TYPE_ALTER) {
      SchemaHelper.setProperty(report, rule.key, rule.value);
    } else if (rule.type === ProjectChangeRule.TYPE_DELETE) {
      SchemaHelper.removeProperty(report, rule.key);
    }
  });
  // Save current version
  reportRepository.storeProject(env, report);
  // Cleanup old reports
  if (hasReportChanged(report, info.title, info.group, info.version)) {
    reportRepository.removeProject(env, info);
    projectRepository.removeAggregatedProject(env, info.title, info.version);
  }
}

function hasReportChanged(report: Project, oldTitle: string, oldGroup: string, oldVersion: string): boolean {
  if (report && report.info && (report.info.title.toLowerCase() !== oldTitle.toLowerCase() || report.info.group.toLowerCase() !== oldGroup.toLowerCase() || report.info.version !== oldVersion)) {
    return true;
  }
  return false;
}
