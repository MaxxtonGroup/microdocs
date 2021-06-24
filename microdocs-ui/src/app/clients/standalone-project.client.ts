import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { ProjectTree, Project, Environments, ProjectChangeRule, ProblemResponse } from "@maxxton/microdocs-core/domain";
import { Observable } from "rxjs";
import { SchemaHelper } from "@maxxton/microdocs-core/helpers/schema/schema.helper";
import { ProjectClient } from "./project.client";
import { map } from "rxjs/operators";

/**
 * Client for the standalone implementation.
 * Uses static json files
 */
@Injectable()
export class StandaloneProjectClient implements ProjectClient {

  baseUrl = "/data";

  constructor( private http: HttpClient ) {
  }


  /**
   * Loads all projects
   * @httpPath env for which environment, default is the current one
   * @httpResponse 200 {TreeNode}
   */


  public loadProjects( /*@Path( "env", { value: 'default' } ) */env: string ): Observable<ProjectTree> {
    return this.http.get(`${this.baseUrl}/projects-${env}.json`).pipe(map(resp => ProjectTree.link( resp )));
  }

  /**
   * Load project
   * @httpPath title name of the project
   * @httpPath version specific version, or if empty the latest
   * @httpPath env for which environment, default is the current one
   * @httpResponse 200 {Project}
   */


  public loadProject( /*@Path( "env", { value: 'default' } )*/ env: string, /*@Path( "title" )*/ title: string, /*@Path( "version" )*/ version?: string ): Observable<Project> {
    return this.http.get(`${this.baseUrl}/projects/${title}-${env}-${version}.json`).pipe(map(resp => SchemaHelper.resolveObject( resp )));
  }

  /**
   * Load all the environments
   * @httpResponse 200 {{[key:string]:Environments}} map of environments
   */


  public getEnvs(): Observable<{ [key: string]: Environments }> {
    return this.http.get<{[key: string]: Environments}>(`${this.baseUrl}/envs.json`);
  }

  public importProject( env: string, project: Project, name: string, group: string, version: string ): Observable<ProblemResponse> {
    throw new Error( 'Import project is not supported in standalone' );
  }

  public deleteProject( env: string, name: string, version?: string ): Observable<any> {
    throw new Error( 'Delete project is not supported in standalone' );
  }

  public updateProject( env: string, name: string, rules: Array<ProjectChangeRule>, version?: string ): Observable<any> {
    throw new Error( 'Update project is not supported in standalone' );
  }

  public reindex( env: string ): Observable<any> {
    throw new Error( 'Reindex is not supported in standalone' );
  }

}
