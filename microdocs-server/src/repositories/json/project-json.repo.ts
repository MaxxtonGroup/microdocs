/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';
import * as path from 'path';

import {Config} from "../../config";
import {ProjectRepository} from "../project.repo";
import {Project} from "../../domain/project.model";
import {ProjectInfo} from "../../domain/common/project-info.model";

/**
 * Json file based repository.
 * The folder structure is: {groupName}/{projectName}/{version}/...
 * @author Steven Hermans
 */
class ProjectJsonRepository implements ProjectRepository {

    public static bootstrap():ProjectJsonRepository {
        return new ProjectJsonRepository();
    }

    /**
     * Load projects metadata
     * @return {ProjectInfo[]} list of project metadata like title, group, version and available versions
     */
    public getProjects():ProjectInfo[] {
        console.log("Load metadata");
        var reportsFolder:string = Config.get("dataFolder") + "/reports";
        var projects = this.scanGroups(reportsFolder);


        return projects
    }

    public getProject(projectInfo:ProjectInfo):Project {
        // validate projectInfo
        if(projectInfo.group == null || projectInfo.group == "" ||
                projectInfo.title == null || projectInfo.title == "" ||
                projectInfo.version == null || projectInfo.version == ""){
            console.warn("Empty project info: " + JSON.stringify(projectInfo));
            return null;
        }
        console.log("Load project: " + projectInfo.title);

        // load microdocs.json
        var reportsFolder:string = Config.get("dataFolder") + "/reports";
        var projectPath = projectInfo.group + "/" + projectInfo.title + "/" + projectInfo.version;
        var projectFolder = reportsFolder + "/" + projectPath;
        var project = this.loadProject(projectFolder + "/microdocs.json");

        // merge project info
        if(project.info == undefined || project.info == null){
            project.info = projectInfo;
        }else{
            project.info.title = projectInfo.title;
            project.info.group = projectInfo.group;
            project.info.version = projectInfo.version;
            project.info.versions = projectInfo.versions;
            if(projectInfo.description != null && projectInfo.description != ""){
                project.info.description = projectInfo.description;
            }
        }

        // find links
        var linkFolders = this.getDirectories(projectFolder);
        if(project.info.links == undefined){
            project.info.links = [];
        }
        linkFolders.forEach(linkFolder => project.info.links.push({rel: linkFolder, href: "/reports/" + projectPath + "/" + linkFolder}));

        return project;
    }


    /**
     * Get folders in a directory
     * @param srcpath directory
     * @return {string[]} list of folder names
     */
    private getDirectories(srcpath):string[] {
        return fs.readdirSync(srcpath).filter(function (file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
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
        var projectInfo = new ProjectInfo();
        projectInfo.title = title;
        projectInfo.group = group;

        var versions = this.getDirectories(folder + "/" + group + "/" + title);
        projectInfo.versions = versions.sort();
        if (versions.length > 0) {
            projectInfo.version = projectInfo.versions[projectInfo.versions.length - 1];
        }

        return projectInfo;
    }

    private loadProject(projectFile:string):Project {
        var string = fs.readFileSync(__dirname + '/../../../' + projectFile);
        var json = JSON.parse(string);
        var project : Project = json;
        return project;
    }

}

var projectRepository = ProjectJsonRepository.bootstrap();
export = projectRepository;