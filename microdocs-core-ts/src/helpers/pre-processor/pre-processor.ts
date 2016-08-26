import {Project, ProjectSettings} from "../../domain";
import {SchemaHelper} from "../schema/schema.helper";

/**
 * Helper for applying custom settings
 * @author Steven Hermans
 */
export class MicroDocsPreProcessor {

  /**
   * Resolve project on different levels: global, env, group and project
   * @param settings
   * @param project
   * @param env
   * @returns {Project}
   */
  public static processProject(settings: ProjectSettings, project: Project, env: string): Project {
    // load variables
    var variables = {};
    if (settings.global && settings.global['_settings']) {
      Object.assign(variables, settings.global['_settings']);
      delete settings.global['_settings'];
    }
    if (settings.environments && settings.environments[env] && settings.environments[env]['_settings']) {
      Object.assign(variables, settings.environments[env]['_settings']);
      delete settings.environments[env]['_settings'];
    }
    if (project.info && project.info.group && settings.groups && settings.groups[project.info.group] && settings.groups[project.info.group]['_settings']) {
      Object.assign(variables, settings.groups[project.info.group]['_settings']);
      delete settings.groups[project.info.group]['_settings'];
    }
    if (project.info && project.info.title && settings.projects && settings.projects[project.info.title] && settings.projects[project.info.title]['_settings']) {
      Object.assign(variables, settings.projects[project.info.title]['_settings']);
      delete settings.projects[project.info.title]['_settings'];
    }

    // process project
    if (settings.global) {
      project = MicroDocsPreProcessor.process(project, settings.global, variables);
    }
    if (settings.environments && settings.environments[env]) {
      project = MicroDocsPreProcessor.process(project, settings.environments[env], variables);
    }
    if (project.info && project.info.group && settings.groups && settings.groups[project.info.group]) {
      project = MicroDocsPreProcessor.process(project, settings.groups[project.info.group], variables);
    }
    if (project.info && project.info.title && settings.projects && settings.projects[project.info.title]) {
      project = MicroDocsPreProcessor.process(project, settings.projects[project.info.title], variables);
    }

    return project;
  }

  /**
   * Resolve project with given settings
   * @param project
   * @param settings
   * @param projectScope
   * @param settingsScope
   * @param variables
   * @returns {any}
   */
  public static process(project: Project, settings: {}, variables: {} = {}, projectScope?: any, settingsScope?: any): any {
    if (settingsScope === undefined) {
      settingsScope = settings;
    }
    if (projectScope === undefined) {
      projectScope = project;
    }
    variables['project'] = project;
    variables['scope'] = projectScope;
    variables['settingsScope'] = settingsScope;
    variables['settings'] = settings;

    if (Array.isArray(settingsScope)) {
      if (projectScope == null) {
        projectScope = [];
      }
      if (Array.isArray(projectScope)) {
        for (var i = 0; i < settingsScope.length; i++) {
          projectScope.push(MicroDocsPreProcessor.process(project, settings, variables, null, settingsScope[i]));
        }
      } else {
        console.warn('Could not process array when it is not one');
      }
    } else if (typeof(settingsScope) == "object") {
      if (projectScope == null || typeof(projectScope) !== 'object') {
        projectScope = {};
      }
      for (var key in settingsScope) {
        var newSettingsScope = settingsScope[key];
        if (!newSettingsScope) {
          newSettingsScope = {};
        }
        var resolvedKey = SchemaHelper.resolveString(key, variables);
        if (resolvedKey) {
          if (resolvedKey.indexOf('{') == 0 && resolvedKey.indexOf('}') == resolvedKey.length - 1) {
            var variableName = resolvedKey.substring(1, resolvedKey.length - 1);
            var oldVarValue = variables[variableName];
            if (Array.isArray(projectScope)) {
              var newProjectScopes = [];
              for (var existingKey = 0; existingKey < projectScope.length; existingKey++) {
                variables[variableName] = existingKey;
                var newProjectScope = projectScope[existingKey];
                if (!newProjectScope) {
                  newProjectScope = null;
                }

                newProjectScope = MicroDocsPreProcessor.process(project, settings, variables, newProjectScope, newSettingsScope);
                newProjectScopes.push(newProjectScope);

                // clean up
                if (oldVarValue) {
                  variables[variableName] = oldVarValue;
                } else {
                  delete variables[variableName];
                }
              }
            } else {
              var newProjectScopes = {};
              for (var existingKey in projectScope) {
                variables[variableName] = existingKey;
                var newProjectScope = projectScope[existingKey];
                if (!newProjectScope) {
                  newProjectScope = null;
                }

                newProjectScope = MicroDocsPreProcessor.process(project, settings, variables, newProjectScope, newSettingsScope);
                newProjectScopes[existingKey] = newProjectScope;

                // clean up
                if (oldVarValue) {
                  variables[variableName] = oldVarValue;
                } else {
                  delete variables[variableName];
                }
              }
            }
            projectScope = newProjectScopes;
          } else {
            if (Array.isArray(projectScope)) {
              console.warn("Could process array as object");
            } else {
              var newProjectScope = projectScope[resolvedKey];
              if (!newProjectScope) {
                newProjectScope = null;
              }
              newProjectScope = MicroDocsPreProcessor.process(project, settings, variables, newProjectScope, newSettingsScope);
              if (newProjectScope != undefined) {
                projectScope[resolvedKey] = newProjectScope;
              }
            }
          }
        }
      }
    } else if (typeof(settingsScope) === 'string') {
      var resolvedValue = SchemaHelper.resolveString(settingsScope, variables);
      if (resolvedValue != undefined) {
        projectScope = resolvedValue;
      }
    } else {
      projectScope = settingsScope;
    }
    return projectScope;
  }

}