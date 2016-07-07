import {Injectable} from "@angular/core";
import { Http, Headers, RequestOptionsArgs, URLSearchParams, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { TreeNode } from "microdocs-core-ts/dist/domain/tree/tree-node.model";
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


}