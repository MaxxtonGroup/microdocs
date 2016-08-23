import {Project, ProjectSettings} from "../../domain";
import {SchemaHelper} from "../schema/schema.helper";
/**
 * @author Steven Hermans
 */
export class ProjectSettingsHelper {

  public static resolveSettings(settings: ProjectSettings, project: Project, env: string):Project {
    if (settings.static.global) {
      project = ProjectSettingsHelper.resolve(project, settings.static.global);
    }
    if (settings.static.environments && settings.static.environments[env]) {
      project = ProjectSettingsHelper.resolve(project, settings.static.environments[env]);
    }
    if (project.info && project.info.group && settings.static.groups && settings.static.groups[project.info.group]) {
      project = ProjectSettingsHelper.resolve(project, settings.static.groups[project.info.group]);
    }
    if (project.info && project.info.title && settings.static.projects && settings.static.projects[project.info.title]) {
      project = ProjectSettingsHelper.resolve(project, settings.static.projects[project.info.title]);
    }

    return project;
  }

  private static resolve(project: Project, settings: {}, projectScope?: any, settingsScope?: any, variables: {} = {}): any {
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
          projectScope.push(ProjectSettingsHelper.resolve(project, settings, null, settingsScope, variables));
        }
      } else {
        console.warn('Could not resolve array when it is not one');
      }
    } else if (typeof(settingsScope) == "object") {
      if (projectScope == null) {
        projectScope = {};
      }
      for (var key in settingsScope) {
        var newSettingsScope = settingsScope[key];
        if(!newSettingsScope){
          newSettingsScope = {};
        }
        var resolvedKey = SchemaHelper.resolveString(key, variables);
        if (resolvedKey) {
          if (resolvedKey.indexOf('{') == 0 && resolvedKey.indexOf('}') == resolvedKey.length - 1) {
            var variableName = resolvedKey.substring(1, resolvedKey.length - 1);
            if (!variables[variableName]) {
              var newProjectScopes = {};
              for (var existingKey in projectScope) {
                variables[variableName] = existingKey;
                var newProjectScope = projectScope[existingKey];
                if(!newProjectScope){
                  newProjectScope = null;
                }

                newProjectScope = ProjectSettingsHelper.resolve(project, settings, newProjectScope, newSettingsScope, variables);
                newProjectScopes[existingKey] = newProjectScope;
              }
              projectScope = newProjectScopes;
            }
          } else {
            var newProjectScope = projectScope[resolvedKey];
            if(!newProjectScope){
              newProjectScope = null;
            }

            newProjectScope = ProjectSettingsHelper.resolve(project, settings, newProjectScope, newSettingsScope, variables);
            projectScope[resolvedKey] = newProjectScope;
          }
        }
      }
    } else {
      projectScope = settingsScope;
    }
    return projectScope;
  }

}