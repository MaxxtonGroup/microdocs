/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';

import {ProjectSettingsRepository} from "../project-settings.repo";
import {Config} from "../../config";
import {ProjectSettings} from 'microdocs-core-ts/dist/domain';

export class ProjectSettingsJsonRepository implements ProjectSettingsRepository{

  public static bootstrap():ProjectSettingsJsonRepository {
    return new ProjectSettingsJsonRepository();
  }

  getSettings():ProjectSettings {
    console.info("Load project settings");
    var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/config";
    var projectFile:string = dataFolder + "/project-settings.json";
    var settings : ProjectSettings = {};
    if(!fs.exists(projectFile)){
      var string = fs.readFileSync(projectFile).toString();
      settings = JSON.parse(string);
    }

    if(settings.environments == undefined || Object.keys(settings.environments).length == 0){
      settings.environments = {default:{default: true}};
    }
    if(settings.conditions == undefined){
      settings.conditions = {};
    }
    if(settings.static == undefined){
      settings.static = {};
    }
    if(settings.static.global == undefined){
      settings.static.global = {};
    }
    if(settings.static.environments == undefined){
      settings.static.environments = {};
    }
    if(settings.static.groups == undefined){
      settings.static.groups = {};
    }
    if(settings.static.projects == undefined){
      settings.static.projects = {};
    }

    return settings;
  }

}