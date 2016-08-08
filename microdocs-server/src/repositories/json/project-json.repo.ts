/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';
import * as path from 'path';
import * as mkdir from 'mkdir-p';

import {Config} from "../../config";
import {ProjectRepository} from "../project.repo";
import {Project, TreeNode} from "microdocs-core-ts/dist/domain";

export class ProjectJsonRepository implements ProjectRepository{

    public static bootstrap():ProjectJsonRepository {
        return new ProjectJsonRepository();
    }

    public getAggregatedProjects():TreeNode {
        console.info("Load metadata");
        var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database";
        var metaFile:string = dataFolder + "/projects.json";
        if(!fs.exists(metaFile)){
            var string = fs.readFileSync(metaFile).toString();
            var json = JSON.parse(string);
            return TreeNode.link(json);
        }
        return null;
    }

    public getAggregatedProject(title:string,version:string):Project{
        console.info("Load project: " + title + ":" + version);
        var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database";
        var projectFolder:string = dataFolder + "/" + title;
        var storeFile:string = projectFolder + "/" + version + ".json";
        if(!fs.exists(storeFile)){
            var string = fs.readFileSync(storeFile).toString();
            var json = JSON.parse(string);
            var project : Project = json;
            return project;
        }
        return null;
    }

    public storeAggregatedProjects(node:TreeNode):void{
        console.info("Store metadata");
        var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database";
        var metaFile:string = dataFolder + "/projects.json";

        mkdir.sync(dataFolder);

        var json = JSON.stringify(node.unlink());
        fs.writeFileSync(metaFile, json);
    }

    public storeAggregatedProject(project:Project):void{
        console.info("Store project: " + project.info.title + ":" + project.info.version);
        var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database";
        var projectFolder:string = dataFolder + "/" + project.info.title;
        var storeFile:string = projectFolder + "/" + project.info.version + ".json";

        mkdir.sync(projectFolder);

        var json = JSON.stringify(project);
        fs.writeFileSync(storeFile, json);
    }

}