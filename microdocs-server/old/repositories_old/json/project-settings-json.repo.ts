
import * as fs from 'fs';
import * as path from 'path';
import * as fsHelper from '../../helpers/file.helper';

import {ProjectSettingsRepository} from "../project-settings.repo";
import {Config} from "../../config";
import {ProjectSettings, Environments} from '@maxxton/microdocs-core/domain';
import { Settings } from "../../../src/domain/settings.model";
import { Metadata } from "../../../src/domain/metadata.model";

export class ProjectSettingsJsonRepository implements ProjectSettingsRepository {

  public getMetadata(): Metadata {
    console.info("Load metadata");
    var dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/database";
    var metadataFile: string = dataFolder + "/metadata.json";
    if(fs.existsSync(metadataFile)){
      let json = fs.readFileSync(metadataFile).toString();
      let metadata = JSON.parse(json);
      return metadata;
    }else{
      return {};
    }
  }

  public saveMetadata( metadata: Metadata ): void {
    console.info("Save metadata");
    var dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/database";
    var metadataFile: string = dataFolder + "/metadata.json";
    let json = JSON.stringify(metadata);
    fs.writeFileSync(metadataFile, json);
  }


  public getSettings(): Settings {
    console.info("Load project envs");
    var dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/config";
    var settingsFile: string = dataFolder + "/settings";
    var settings: Settings = {};
    settings = this.loadFile(settingsFile) || settings;
    if (!settings || !settings.envs || Object.keys(settings.envs).length == 0) {
      settings = {envs:{default: {default: true}}};
    }

    return settings;
  }

  public getProjectSettings(): ProjectSettings {
    console.info("Load project settings");
    var dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/config/scripts";
    var settings: ProjectSettings = {global: {}, environments: {}, groups: {}, projects: {}};

    // Load globals
    settings.global = this.loadFile(dataFolder + "/global");

    // Load envs
    var envFolder:string = dataFolder + "/envs";
    var envs = fsHelper.getFiles(envFolder);
    if(envs){
      envs.map(env => env.split('.')[0]).forEach(env => {
        let envFile = envFolder + '/' + env;
        settings.environments[env] = this.loadFile(envFile);
      });
    }

    // Load groups
    var groupsFolder:string = dataFolder + "/groups";
    var groups = fsHelper.getFiles(groupsFolder);
    if(groups){
      groups.map(group => group.split('.')[0]).forEach(group => {
        let groupFile = groupsFolder + '/' + group;
        settings.groups[group] = this.loadFile(groupFile);
      });
    }

    // Load Projects
    var projectsFolder:string = dataFolder + "/projects";
    var projects = fsHelper.getFiles(projectsFolder);
    if(projects){
      projects.map(project => project.split('.')[0]).forEach(project => {
        let projectFile = projectsFolder + '/' + project;
        settings.projects[project] = this.loadFile(projectFile);
      });
    }

    return settings;
  }

  private loadFile(path:string):{}{
    if(fs.existsSync(path + '.js')){
      console.info('load settings: ' + path + '.js');
      let content:string = fs.readFileSync(path + '.js').toString();
      return eval(content);
    }
    if(fs.existsSync(path + '.json')){
      console.info('load settings: ' + path + '.json');
      let content:string = fs.readFileSync(path + '.json').toString();
      return JSON.parse(content);
    }
    console.info('cannot load settings: ' + path);
    return {};
  }

}