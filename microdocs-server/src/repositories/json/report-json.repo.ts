/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';
import * as path from 'path';

import {Config} from "../../config";
import {ReportRepository} from "../report.repo";
import {Project, ProjectInfo} from "@maxxton/microdocs-core/domain";
import * as mkdir from 'mkdir-p';
import * as fsHelper from '../../helpers/file.helper';

/**
 * Json file based repository.
 * The folder structure is: {groupName}/{projectName}/{version}/...
 * @author Steven Hermans
 */
export class ReportJsonRepository implements ReportRepository {
  
  /**
   * Remove report
   * @param env for which env
   * @param info group/title/version info
   * @return false if the report file doesn't exists otherwise true
   */
  public removeProject(env:string, info:ProjectInfo):boolean {
    console.log("Remove report: " + info.title + ":" + info.version);
    var reportsFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/reports/" + env;
    var projectPath:string = info.group.toLowerCase() + "/" + info.title.toLowerCase() + (info.version ? "/" + info.version.toLowerCase() : '');
    var projectFolder = reportsFolder + "/" + projectPath;
    
    if (fs.existsSync(projectFolder)) {
      fsHelper.deleteFolderRecursive(projectFolder);
      fsHelper.cleanEmptyFolders(reportsFolder);
      return true;
    }
    return false;
  }
  
  /**
   * Load projects metadata
   * @return {ProjectInfo[]} list of project metadata like title, group, version and available versions
   */
  public getProjects(env:string):ProjectInfo[] {
    console.log("Load metadata");
    var reportsFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/reports/" + env;
    var projects = this.scanGroups(reportsFolder);
    
    return projects;
  }
  
  /**
   * Load project
   * @param projectInfo
   * @returns {Project} loaded project or null
   */
  public getProject(env:string, projectInfo:ProjectInfo):Project {
    // validate projectInfo
    if (projectInfo.group == null || projectInfo.group == "" ||
      projectInfo.title == null || projectInfo.title == "" ||
      projectInfo.version == null || projectInfo.version == "") {
      console.warn("Empty project info: " + JSON.stringify(projectInfo));
      return null;
    }
    console.log("Load project: " + projectInfo.title + ":" + projectInfo.version);
    
    // load microdocs.json
    var reportsFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/reports/" + env;
    var projectPath = projectInfo.group.toLowerCase() + "/" + projectInfo.title.toLowerCase() + "/" + projectInfo.version.toLowerCase();
    var projectFolder = reportsFolder + "/" + projectPath;
    var project = this.loadProject(projectFolder + "/microdocs.json");
    
    // merge project info
    if (project.info == undefined || project.info == null) {
      project.info = projectInfo;
    } else {
      project.info.title = projectInfo.title.toLowerCase();
      project.info.group = projectInfo.group.toLowerCase();
      project.info.version = projectInfo.version.toLowerCase();
      project.info.versions = projectInfo.versions;
      if (projectInfo.description != null && projectInfo.description != "") {
        project.info.description = projectInfo.description;
      }
    }
    
    // find links
    var linkFolders = this.getDirectories(projectFolder);
    if (project.info.links == undefined) {
      project.info.links = [];
    }
    linkFolders.forEach(linkFolder => project.info.links.push({
      rel: linkFolder,
      href: "/reports/" + env + "/" + projectPath + "/" + linkFolder
    }));
    
    return project;
  }
  
  /**
   * Store projects
   * @param project
   */
  public storeProject(env:string, project:Project):void {
    console.info("Store report: " + project.info.title + ":" + project.info.version);
    // set update time
    project.info.updateTime = new Date().toISOString();

    var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/reports/" + env;
    var groupFolder:string = dataFolder + "/" + project.info.group.toLowerCase();
    var projectFolder:string = groupFolder + "/" + project.info.title.toLowerCase();
    var versionFolder:string = projectFolder + "/" + project.info.version.toLowerCase();
    var storeFile:string = versionFolder + "/microdocs.json";
    
    mkdir.sync(versionFolder);
    
    var json = JSON.stringify(project);
    fs.writeFileSync(storeFile, json);
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
  
  /**
   * Scan the reports folder for groups -> projects -> versions
   * @param folder reports folder
   * @return {ProjectInfo[]} list of projects inside all the groups
   */
  private scanGroups(folder:string):ProjectInfo[] {
    var projectList:ProjectInfo[] = [];
    
    var groups = this.getDirectories(folder);
    groups.forEach(group => {
      var projects = this.scanProjects(group, folder);
      projects.forEach(project => projectList.push(project));
    });
    
    return projectList;
  }
  
  /**
   * Scan folder for projects -> version
   * @param group name of the group
   * @param folder reports folder
   * @return {ProjectInfo[]} list of all projects this group
   */
  private scanProjects(group:string, folder:string):ProjectInfo[] {
    var projectList:ProjectInfo[] = [];
    
    var projects = this.getDirectories(folder + "/" + group);
    projects.forEach(title => {
      projectList.push(this.scanProject(group, title, folder));
    });
    return projectList;
  }
  
  /**
   * Scan folder for project information
   * @param group name of the group
   * @param title name of the project
   * @param folder reports folder
   * @return {ProjectInfo} Project information
   */
  private scanProject(group:string, title:string, folder:string):ProjectInfo {
    var versions = this.getDirectories(folder + "/" + group + "/" + title);
    var versions = versions.sort();
    if (versions.length > 0) {
      var version = versions[versions.length - 1];
    }
    
    return new ProjectInfo(title, group, version, versions);
  }
  
  private loadProject(projectFile:string):Project {
    var string = fs.readFileSync(projectFile).toString();
    var json = JSON.parse(string);
    var project:Project = json;
    return project;
  }
  
}


