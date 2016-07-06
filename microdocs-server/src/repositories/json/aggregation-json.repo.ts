/// <reference path="../../_all.d.ts" />
import * as fs from 'fs';
import * as path from 'path';

import {Config} from "../../config";
import {AggregationRepository} from "../aggregation.repo";
import {Project} from "../../domain/project.model";
import {TreeNode} from "../../domain/tree/tree-node.model";

class AggregationJsonResitory implements AggregationRepository{

    public static bootstrap():AggregationJsonResitory {
        return new AggregationJsonResitory();
    }

    // public getAggregatedProjects():TreeNode {
    //
    // }
    //
    // public getAggregatedProject(title:string,version:string):Project{
    //
    // }

    public storeAggregatedProjects(node:TreeNode):void{
        console.info("Store metadata");
        var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database";
        var metaFile:string = dataFolder + "/projects.json";

        if(!fs.exists(dataFolder))
            fs.mkdirSync(dataFolder);

        var json = JSON.stringify(node.unlink());
        fs.writeFileSync(metaFile, json);
    }

    public storeAggregatedProject(project:Project):void{
        console.info("Store project: " + project.info.title + ":" + project.info.version);
        var dataFolder:string = __dirname + '/../../../' + Config.get("dataFolder") + "/database";
        var projectFolder:string = dataFolder + "/" + project.info.title;
        var storeFile:string = projectFolder + "/" + project.info.version + ".json";

        if(!fs.exists(dataFolder))
            fs.mkdirSync(dataFolder);
        if(!fs.exists(projectFolder))
            fs.mkdirSync(projectFolder);

        var json = JSON.stringify(project);
        fs.writeFileSync(storeFile, json);
    }

}

var aggregationRepository = AggregationJsonResitory.bootstrap();
export = aggregationRepository;