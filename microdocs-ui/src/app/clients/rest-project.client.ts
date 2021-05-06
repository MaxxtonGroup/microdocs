import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ProjectTree, Project, Environments, ProjectChangeRule, ProblemResponse } from "@maxxton/microdocs-core/dist/domain";
import { Observable } from "rxjs";
import { ProjectClient } from "./project.client";
import { map } from "rxjs/operators";
import { SchemaHelper } from "@maxxton/microdocs-core/dist/helpers";

/**
 * Client for integration with the microdocs-server implementation.
 * Uses the Rest api of the microdocs-server
 */
@Injectable()
export class RestProjectClient implements ProjectClient {

  baseUrl = "api/v1";

  constructor( private http: HttpClient ) {
  }

  /**
   * Loads all projects
   * @httpQuery env for which environment, default is the current one
   * @httpResponse 200 {TreeNode}
   */
  public loadProjects( /*@Query( "env" )*/ env: string ): Observable<ProjectTree> {
    return this.http.get(`${this.baseUrl}/projects`).pipe(map(resp => ProjectTree.link( resp )));
  }

  /**
   * Load project
   * @httpPath title name of the project
   * @httpQuery version specific version, or if empty the latest
   * @httpQuery env for which environment, default is the current one
   * @httpBody body {Project}
   * @httpResponse 200 {Project}
   */
//  @Get( "/projects/{title}" )
//  @Map( resp => SchemaHelper.resolveObject( resp.json() ) )
  public loadProject( /*@Query( "env" )*/ env: string, /*@Path( "title" )*/ title: string, /*@Query( "version" )*/ version?: string ): Observable<Project> {
    return this.http.get(`${this.baseUrl}/projects/${title}?env=${env}&version=${version}`).pipe(map(resp => SchemaHelper.resolveObject( resp )));
  }

  /**
   * Load all the environments
   * @httpResponse 200 {{[key: string]: Environments}}
   */
//  @Get( "/envs" )
//  @Map( resp => resp.json() )
  public getEnvs(): Observable<{[key: string]: Environments}> {
    return this.http.get<{[key: string]: Environments}>(`${this.baseUrl}/envs`);
  }

//  @Put( "/projects/{title}" )
//  @Map( resp => resp.json() )
  public importProject( /*@Query( "env" )*/ env: string, /*@Body*/ project: Project, /*@Path( "title" )*/ title: string, /*@Query( "group" )*/ group: string, /*@Query( "version" )*/ version: string ): Observable<ProblemResponse> {
    return this.http.put(`${this.baseUrl}/projects/${title}?env=${env}&group=${group}&version=${version}`, project).pipe(map(resp => SchemaHelper.resolveObject( resp )));
  }

//  @Delete( "/projects/{title}" )
  public deleteProject( /*@Query( 'env' )*/ env: string, /*@Path( 'title' )*/ title: string, /*@Query( 'version' )*/ version?: string ): Observable<any> {
    return this.http.delete(`${this.baseUrl}/projects/${title}`);
  }

//  @Patch( "/projects/{title}" )
  public updateProject( /*@Query( 'env' )*/ env: string, /*@Path( 'title' )*/ title: string, /*@Body*/ rules: Array<ProjectChangeRule>, /*@Query( 'version' )*/ version?: string ): Observable<any> {
    return this.http.put(`${this.baseUrl}/projects/${title}?env=${env}&version=${version}`, rules).pipe(map(resp => SchemaHelper.resolveObject( resp )));
  }

//  @Put( "/reindex" )
  reindex( /*@Query( 'env' )*/ env: string ): Observable<any> {
    return this.http.put(`${this.baseUrl}/reindex?env=${env}`, {});
  }

}
