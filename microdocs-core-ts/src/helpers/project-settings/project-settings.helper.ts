import {Project, ProjectSettings} from "../../domain";
/**
 * @author Steven Hermans
 */
export class ProjectSettingsHelper {

    public static resolveSettings(project:Project, env:string, settings:ProjectSettings) {
        if (settings.static.global) {
            ProjectSettingsHelper.resolveStatic(project, settings.static.global);
        }
        if (settings.static.environments && settings.static.environments[env]) {
            ProjectSettingsHelper.resolveStatic(project, settings.static.environments[env]);
        }
        if (project.info && project.info.group && settings.static.groups && settings.static.groups[project.info.group]) {
            ProjectSettingsHelper.resolveStatic(project, settings.static.groups[project.info.group]);
        }
        if (project.info && project.info.title && settings.static.projects && settings.static.projects[project.info.title]) {
            ProjectSettingsHelper.resolveStatic(project, settings.static.projects[project.info.title]);
        }

    }

    private static resolveStatic(project:Project, settings:{}, scope?:{}, variables:{} = {}) {
        if (!scope) {
            scope = settings;
        }
        variables['project'] = project;
        variables['scope'] = scope;
        variables['settings'] = settings;

        if(Array.isArray(scope)){

        }else if(typeof(scope) == "object"){
            for(var key in scope){
                
            }
        }else{
            return scope;
        }
    }

}