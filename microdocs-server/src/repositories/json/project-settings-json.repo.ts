
import * as fs from 'fs';
import * as path from 'path';
import * as fsHelper from '../../helpers/file.helper';

import {ProjectSettingsRepository} from "../project-settings.repo";
import {Config} from "../../config";
import {ProjectSettings, Environments} from '@maxxton/microdocs-core/domain';
import { Settings } from "../../domain/settings.model";
import { Metadata } from "../../domain/metadata.model";

export class ProjectSettingsJsonRepository implements ProjectSettingsRepository {

  public getMetadata(): Metadata {
    console.info("Load metadata");
    const dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/database";
    const metadataFile: string = dataFolder + "/metadata.json";
    if (fs.existsSync(metadataFile)) {
      const json = fs.readFileSync(metadataFile).toString();
      const metadata = JSON.parse(json);
      return metadata;
    } else {
      return {};
    }
  }

  public saveMetadata( metadata: Metadata ): void {
    console.info("Save metadata");
    const dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/database";
    const metadataFile: string = dataFolder + "/metadata.json";
    const json = JSON.stringify(metadata);
    fs.writeFileSync(metadataFile, json);
  }


  public getSettings(): Settings {
    console.info("Load project envs");
    const dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/config";
    const settingsFile: string = dataFolder + "/settings";
    let settings: Settings = {};
    settings = this.loadFile(settingsFile) || settings;
    if (!settings || !settings.envs || Object.keys(settings.envs).length == 0) {
      settings = {envs: {default: {default: true}}};
    }

    return settings;
  }

  public getProjectSettings(): ProjectSettings {
    console.info("Load project settings");
    const dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/config/scripts";
    const settings: ProjectSettings = {global: {}, environments: {}, groups: {}, projects: {}};

    // Load globals
    settings.global = this.loadFile(dataFolder + "/global");

    // Load envs
    const envFolder: string = dataFolder + "/envs";
    const envs = fsHelper.getFiles(envFolder);
    if (envs) {
      envs.map(env => env.split('.')[0]).forEach(env => {
        const envFile = envFolder + '/' + env;
        settings.environments[env] = this.loadFile(envFile);
      });
    }

    // Load groups
    const groupsFolder: string = dataFolder + "/groups";
    const groups = fsHelper.getFiles(groupsFolder);
    if (groups) {
      groups.map(group => group.split('.')[0]).forEach(group => {
        const groupFile = groupsFolder + '/' + group;
        settings.groups[group] = this.loadFile(groupFile);
      });
    }

    // Load Projects
    const projectsFolder: string = dataFolder + "/projects";
    const projects = fsHelper.getFiles(projectsFolder);
    if (projects) {
      projects.map(project => project.split('.')[0]).forEach(project => {
        const projectFile = projectsFolder + '/' + project;
        settings.projects[project] = this.loadFile(projectFile);
      });
    }

    return settings;
  }

  private loadFile(path: string): {} {
    if (fs.existsSync(path + '.js')) {
      console.info('load settings: ' + path + '.js');
      const content: string = fs.readFileSync(path + '.js').toString();
      return eval(content);
    }
    if (fs.existsSync(path + '.json')) {
      console.info('load settings: ' + path + '.json');
      const content: string = fs.readFileSync(path + '.json').toString();
      return JSON.parse(content);
    }
    console.info('cannot load settings: ' + path);
    return {};
  }

}
