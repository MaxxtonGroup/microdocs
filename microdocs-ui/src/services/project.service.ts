import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptionsArgs, URLSearchParams, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

import {TreeNode, Project, Environments} from "microdocs-core-ts/dist/domain";
import {MicroDocsConfig as config} from "../config/config";
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";

@Injectable()
export class ProjectService {

  private env:string;

  constructor(private http: Http) {
  }

  public getProjects(env?: string): Observable<TreeNode> {
    if(env == undefined){
      env = this.getSelectedEnv();
    }
    if(env) {
      return this.http.get(this.getApiUrl('/projects', {env: env})).map(resp => {
        var json = resp.json();
        return TreeNode.link(json);
      });
    }
    return null;
  }

  public getProject(name: string, version?: string, env?: string): Observable<Project> {
    if(env == undefined){
      env = this.getSelectedEnv();
    }

    return this.http.get(this.getApiUrl('/projects/' + name, {version: version, env: env})).map(resp => {
      var json = resp.json();

      // resolve references
      var resolvedJson = SchemaHelper.resolveObject(json);

      return resolvedJson as Project;
    });
  }

  public setSelectedEnv(env: string) {
    this.env = env;
  }

  public getSelectedEnv(): string {
    return this.env;
  }

  public getEnvs(): Observable<{[key:string]:Environments}> {
    return this.http.get(this.getApiUrl("/envs")).map(resp => resp.json());
  }
  
  private getApiUrl(path:string, params?:{[key: string]: any}){
    var fullPath = config.apiPath + path;
    if(config.isStandAlone){
      if(params) {
        Object.keys(params).sort().filter(key => params[key]).forEach(key => fullPath += "-" + params[key]);
      }
      fullPath += '.json';
    }else{
      if(params) {
        var first = true;
        Object.keys(params).sort().filter(key => params[key]).forEach(key => {
          if(first){
            first = false;
            fullPath += "?" + key + '=' + params[key];
          }else {
            fullPath += "&" + key + '=' + params[key];
          }
        });
      }
    }
    return fullPath;
  }


}