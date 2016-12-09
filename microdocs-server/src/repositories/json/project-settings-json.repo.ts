/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';
import * as path from 'path';
import * as fsHelper from '../../helpers/file.helper';

import {ProjectSettingsRepository} from "../project-settings.repo";
import {Config} from "../../config";
import {ProjectSettings, Environments} from '@maxxton/microdocs-core/domain';

export class ProjectSettingsJsonRepository implements ProjectSettingsRepository {

  public getEnvs(): {[name: string]: Environments} {
    console.info("Load project envs");
    var dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/config";
    var projectFile: string = dataFolder + "/envs";
    var envs: {[name: string]: Environments} = {};
    envs = this.loadFile(projectFile) || envs;
    if (!envs || Object.keys(envs).length == 0) {
      envs = {default: {default: true}};
    }

    return envs;
  }

  public getSettings(): ProjectSettings {
    console.info("Load project settings");
    var dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/config/scripts";
    var settings: ProjectSettings = {global: {}, environments: {}, groups: {}, projects: {}};

    // Load globals
    settings.global = this.loadFile(dataFolder + "/global");

    // Load envs
    var envFolder:string = dataFolder + "/envs";
    var envs = fsHelper.getDirectories(envFolder);
    if(envs){
      envs.forEach(env => {
        let envFile = envFolder + '/' + env;
        settings.environments[env] = this.loadFile(envFile);
      });
    }

    // Load groups
    var groupsFolder:string = dataFolder + "/groups";
    var groups = fsHelper.getDirectories(groupsFolder);
    if(groups){
      groups.forEach(group => {
        let groupFile = groupsFolder + '/' + group;
        settings.groups[group] = this.loadFile(groupFile);
      });
    }

    // Load Projects
    var projectsFolder:string = dataFolder + "/projects";
    var projects = fsHelper.getDirectories(projectsFolder);
    if(projects){
      projects.forEach(project => {
        let projectFile = projectsFolder + '/' + project;
        settings.projects[project] = this.loadFile(projectFile);
      });
    }

    return settings;
  }

  private loadFile(path:string):{}{
    if(fs.existsSync(path + '.js')){
      let content:string = fs.readFileSync(path + '.js').toString();
      return eval(content);
    }
    if(fs.existsSync(path + '.json')){
      let content:string = fs.readFileSync(path + '.json').toString();
      return JSON.parse(content);
    }
    return {};
  }

}