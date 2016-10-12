import {Observable} from "rxjs/Observable";

import {TreeNode, Project, Environments} from "microdocs-core-ts/dist/domain";
import {Http} from "@angular/http";
import {RestClient} from "angular2-rest/angular2-rest";

export abstract class ProjectService extends RestClient{

  constructor(http:Http){
    super(http);
  }

  abstract getProjects(env?: string): Observable<TreeNode>;

  abstract getProject(name: string, version?: string, env?: string): Observable<Project>;

  abstract setSelectedEnv(env: string);

  abstract getSelectedEnv(): string;

  abstract getEnvs(): Observable<{[key:string]:Environments}>;

}