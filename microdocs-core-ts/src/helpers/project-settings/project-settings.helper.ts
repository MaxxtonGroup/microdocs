import {Project, ProjectSettings} from "../../domain";
import {SchemaHelper} from "../schema/schema.helper";

/**
 * Helper for applying custom settings
 * @author Steven Hermans
 */
export class ProjectSettingsHelper {

  /**
   * Resolve project on different levels: global, env, group and project
   * @param settings
   * @param project
   * @param env
   * @returns {Project}
   */
  public static resolveProject(settings: ProjectSettings, project: Project, env: string): Project {
    if (settings.global) {
      project = ProjectSettingsHelper.resolve(project, settings.global);
    }
    if (settings.environments && settings.environments[env]) {
      project = ProjectSettingsHelper.resolve(project, settings.environments[env]);
    }
    if (project.info && project.info.group && settings.groups && settings.groups[project.info.group]) {
      project = ProjectSettingsHelper.resolve(project, settings.groups[project.info.group]);
    }
    if (project.info && project.info.title && settings.projects && settings.projects[project.info.title]) {
      project = ProjectSettingsHelper.resolve(project, settings.projects[project.info.title]);
    }

    // do it twice to catch new defined properties
    if (settings.global) {
      project = ProjectSettingsHelper.resolve(project, settings.global);
    }
    if (settings.environments && settings.environments[env]) {
      project = ProjectSettingsHelper.resolve(project, settings.environments[env]);
    }
    if (project.info && project.info.group && settings.groups && settings.groups[project.info.group]) {
      project = ProjectSettingsHelper.resolve(project, settings.groups[project.info.group]);
    }
    if (project.info && project.info.title && settings.projects && settings.projects[project.info.title]) {
      project = ProjectSettingsHelper.resolve(project, settings.projects[project.info.title]);
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
  public static resolve(project: Project, settings: {}, projectScope?: any, settingsScope?: any, variables: {} = {}): any {
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
          projectScope.push(ProjectSettingsHelper.resolve(project, settings, null, settingsScope[i], variables));
        }
      } else {
        console.warn('Could not resolve array when it is not one');
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

                newProjectScope = ProjectSettingsHelper.resolve(project, settings, newProjectScope, newSettingsScope, variables);
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

                newProjectScope = ProjectSettingsHelper.resolve(project, settings, newProjectScope, newSettingsScope, variables);
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
              console.warn("Could resolve array as object");
            } else {
              var newProjectScope = projectScope[resolvedKey];
              if (!newProjectScope) {
                newProjectScope = null;
              }
              newProjectScope = ProjectSettingsHelper.resolve(project, settings, newProjectScope, newSettingsScope, variables);
              if(newProjectScope != undefined) {
                projectScope[resolvedKey] = newProjectScope;
              }
            }
          }
        }
      }
    } else if (typeof(settingsScope) === 'string') {
      var resolvedValue = SchemaHelper.resolveString(settingsScope, variables);
      if(resolvedValue != undefined){
        projectScope = resolvedValue;
      }
    } else {
      projectScope = settingsScope;
    }
    return projectScope;
  }

}