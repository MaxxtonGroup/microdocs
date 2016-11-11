/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';
import * as path from 'path';

import {ProjectSettingsRepository} from "../project-settings.repo";
import {Config} from "../../config";
import {ProjectSettings, Environments} from '@maxxton/microdocs-core/domain';

export class ProjectSettingsJsonRepository implements ProjectSettingsRepository {

  getEnvs(): {[name: string]: Environments} {
    console.info("Load project envs");
    var dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/config";
    var projectFile: string = dataFolder + "/envs.json";
    var envs: {[name: string]: Environments} = {};
    if (fs.existsSync(projectFile)) {
      var string = fs.readFileSync(projectFile).toString();
      envs = JSON.parse(string);
    }
    if (!envs || Object.keys(envs).length == 0) {
      envs = {default: {default: true}};
    }

    return envs;
  }

  getSettings(): ProjectSettings {
    console.info("Load project settings");
    var dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/config/project-settings";
    var settings: ProjectSettings = {global: {}, environments: {}, groups: {}, projects: {}};

    // Load globals
    var globalFile: string = dataFolder + "/global.json";
    if (fs.existsSync(globalFile)) {
      let string = fs.readFileSync(globalFile).toString();
      settings.global = JSON.parse(string);
    }

    // Load envs
    var envFolder:string = dataFolder + "/envs";
    var envs = this.getDirectories(envFolder);
    if(envs){
      envs.forEach(env => {
        let envFile = envFolder + '/' + env;
        if (fs.existsSync(envFile)) {
          let string = fs.readFileSync(envFile).toString();
          settings.environments[env] = JSON.parse(string);
        }
      });
    }

    // Load groups
    var groupsFolder:string = dataFolder + "/groups";
    var groups = this.getDirectories(groupsFolder);
    if(groups){
      groups.forEach(group => {
        let groupFile = groupsFolder + '/' + group;
        if (fs.existsSync(groupFile)) {
          let string = fs.readFileSync(groupFile).toString();
          settings.groups[group] = JSON.parse(string);
        }
      });
    }

    // Load Projects
    var projectsFolder:string = dataFolder + "/projects";
    var projects = this.getDirectories(projectsFolder);
    if(projects){
      projects.forEach(project => {
        let projectFile = projectsFolder + '/' + project;
        if (fs.existsSync(projectFile)) {
          let string = fs.readFileSync(projectFile).toString();
          settings.projects[project] = JSON.parse(string);
        }
      });
    }

    return settings;
  }

  /**
   * Get folders in a directory
   * @param srcpath directory
   * @return {string[]} list of folder names
   */
  private getDirectories(dir:string):string[] {
    if (fs.existsSync(dir)) {
      return fs.readdirSync(dir).filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
    }
    return [];
  }

}