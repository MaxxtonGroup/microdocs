/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';
import * as path from 'path';

import {Config} from "../../config";
import {ProjectRepository} from "../project.repo";
import {Project} from "../../domain/project.model";
import {ProjectInfo} from "../../domain/project-info.model";

/**
 * @author Steven Hermans
 */
class ProjectJsonRepository implements ProjectRepository {

    public static bootstrap():ProjectJsonRepository {
        return new ProjectJsonRepository();
    }

    /**
     * Load
     */
    public getProjects():ProjectInfo[] {
        var reportsFolder:string = Config.get("dataFolder") + "/reports";
        var projects = this.scanGroups(reportsFolder);


        return projects;
    }

    private getDirectories(srcpath):string[] {
        return fs.readdirSync(srcpath).filter(function (file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    }

    private scanGroups(folder:string):ProjectInfo[] {
        var projectList:ProjectInfo[] = [];

        var groups = this.getDirectories(folder);
        groups.forEach(group => {
            var projects = this.scanProjects(group, folder);
            projects.forEach(project => projectList.push(project));
        });

        return projectList;
    }

    private scanProjects(group:string, folder:string):ProjectInfo[] {
        var projectList:ProjectInfo[] = [];

        var projects = this.getDirectories(folder + "/" + group);
        projects.forEach(title => {
            projectList.push(this.scanProject(group, title, folder));
        });
        return projectList;
    }

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

}

var projectRepository = ProjectJsonRepository.bootstrap();
export = projectRepository;