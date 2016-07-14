/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';

import {ProjectSettingsRepository} from "../project-settings.repo";
import {Config} from "../../config";

export class ProjectSettingsJsonRepository implements ProjectSettingsRepository{

  public static bootstrap():ProjectSettingsJsonRepository {
    return new ProjectSettingsJsonRepository();
  }

  getSettings():{} {
    console.info("Load project settings");
    var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/config";
    var projectFile:string = dataFolder + "/project-settings.json";
    if(!fs.exists(projectFile)){
      var string = fs.readFileSync(projectFile).toString();
      var json = JSON.parse(string);
      return json;
    }
    return {'global': {}, 'groups': {}, 'projects': {}};
  }

}