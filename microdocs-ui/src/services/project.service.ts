import {Observable} from "rxjs/Observable";

import {TreeNode, Project, Environments} from "microdocs-core-ts/dist/domain";

export interface ProjectService {

  getProjects(env: string): Observable<TreeNode>;

  getProject(name: string, version?: string, env?: string): Observable<Project>;

  setSelectedEnv(env: string);

  getSelectedEnv(): string;

  getEnvs(): Observable<{[key:string]:Environments}>;


}