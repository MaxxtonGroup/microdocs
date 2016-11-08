/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';
import * as path from 'path';
import * as mkdir from 'mkdir-p';

import {Config} from "../../config";
import {ProjectRepository} from "../project.repo";
import {Project, ProjectTree} from "@maxxton/microdocs-core/domain";
import * as fsHelper from '../../helpers/file.helper';

export class ProjectJsonRepository implements ProjectRepository {
  
  public removeAggregatedProject(env:string, title:string, version?:string):boolean {
    console.info("Remove project: " + title + ":" + version);
    
    var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database/" + env;
    var projectFolder:string = dataFolder + "/" + title;
    
    if (version) {
      var storeFile:string = projectFolder + "/" + version + ".json";
      if (fs.existsSync(storeFile)) {
        fs.unlinkSync(storeFile);
        // cleanEmptyFolders(dataFolder);
        return true;
      }
    } else {
      if (fs.existsSync(projectFolder)) {
        fsHelper.deleteFolderRecursive(projectFolder);
        fsHelper.cleanEmptyFolders(dataFolder);
        return true;
      }
    }
    
    return false;
  }
  
  public getAggregatedProjects(env:string):ProjectTree {
    console.info("Load metadata");
    var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database/" + env;
    var metaFile:string = dataFolder + "/projects.json";
    if (fs.existsSync(metaFile)) {
      var string = fs.readFileSync(metaFile).toString();
      var json = JSON.parse(string);
      return ProjectTree.link(json);
    }
    return null;
  }
  
  public getAggregatedProject(env:string, title:string, version:string):Project {
    console.info("Load project: " + title + ":" + version);
    var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database/" + env;
    var projectFolder:string = dataFolder + "/" + title;
    var storeFile:string = projectFolder + "/" + version + ".json";
    if (fs.existsSync(storeFile)) {
      var string = fs.readFileSync(storeFile).toString();
      var json = JSON.parse(string);
      var project:Project = json;
      return project;
    }
    return null;
  }
  
  public storeAggregatedProjects(env:string, projectTree:ProjectTree):void {
    console.info("Store metadata");
    var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database/" + env;
    var metaFile:string = dataFolder + "/projects.json";
    
    mkdir.sync(dataFolder);
    
    var json = JSON.stringify(projectTree.unlink());
    fs.writeFileSync(metaFile, json);
  }
  
  public storeAggregatedProject(env:string, project:Project):void {
    console.info("Store project: " + project.info.title + ":" + project.info.version);
    var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database/" + env;
    var projectFolder:string = dataFolder + "/" + project.info.title;
    var storeFile:string = projectFolder + "/" + project.info.version + ".json";
    
    mkdir.sync(projectFolder);
    
    var json = JSON.stringify(project);
    fs.writeFileSync(storeFile, json);
  }
  
}