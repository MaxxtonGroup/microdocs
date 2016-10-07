import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptionsArgs, URLSearchParams, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

import {TreeNode, Project, Environments} from "microdocs-core-ts/dist/domain";
import {NewyseConfig as config} from "../config/config";
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";
import {PreferenceService} from "@maxxton/components/services";

@Injectable()
export class ProjectService {

  private env:string;

  constructor(private http: Http) {
  }

  public getProjects(env?: string): Observable<TreeNode> {
    if(env == undefined){
      env = this.getSelectedEnv();
    }
    var envParam = (env != undefined ? "?env=" + env : "");

    var url = config.apipath + "/projects" + envParam;
    return this.http.get(url).map(resp => {
      var json = resp.json();
      return TreeNode.link(json);
    });
  }

  public getProject(name: string, version?: string, env?: string): Observable<Project> {
    var versionParam = (version != undefined ? "&version=" + version : "");
    if(env == undefined){
      env = this.getSelectedEnv();
    }
    var envParam = (env != undefined ? "&env=" + env : "");

    return this.http.get(config.apipath + '/projects/' + name + '?' + versionParam + envParam).map(resp => {
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
    return this.http.get(config.apipath + "/envs").map(resp => resp.json());
  }


}