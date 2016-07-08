import {Injectable} from "@angular/core";
import { Http, Headers, RequestOptionsArgs, URLSearchParams, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";

import { TreeNode, Project } from "microdocs-core-ts/dist/domain";
import { NewyseConfig as config } from "../config/config";
@Injectable()
export class ProjectService{

    constructor(private http:Http){}
    
    public getProjects():Observable<TreeNode>{
        return this.http.get(config.apipath + "/projects").map(resp => {
            var json = resp.json();
            return TreeNode.link(json);
        });
    }

    public getProject(name:string, version?:string) : Observable<Project>{
        var versionParam = (version != undefined ? "?version=" + version : "");
        return this.http.get(config.apipath + '/projects/' + name + versionParam).map(resp => resp.json() as Project);
    }


}