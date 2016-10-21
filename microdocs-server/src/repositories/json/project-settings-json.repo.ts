/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';

import {ProjectSettingsRepository} from "../project-settings.repo";
import {Config} from "../../config";
import {ProjectSettings, Environments} from '@maxxton/microdocs-core-ts/dist/domain';

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
    var dataFolder: string = __dirname + '/../../../' + Config.get("dataFolder") + "/config";
    var projectFile: string = dataFolder + "/project-settings.json";
    var settings: ProjectSettings = {};
    if (fs.existsSync(projectFile)) {
      var string = fs.readFileSync(projectFile).toString();
      settings = JSON.parse(string);
    }

    if (!settings.global) {
      settings.global = {};
    }
    if (!settings.environments) {
      settings.environments = {};
    }
    if (!settings.groups) {
      settings.groups = {};
    }
    if (!settings.projects) {
      settings.projects = {};
    }
    return settings;
  }

}