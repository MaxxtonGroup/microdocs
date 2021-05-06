import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
//import {
//  RestClient,
//  HttpClient,
//  Get,
//  Path,
//  Query,
//  Map,
//  Produces, MediaType, Client
//} from "@maxxton/angular-rest";
import { ProjectTree, Project, Environments, ProjectChangeRule, ProblemResponse } from "@maxxton/microdocs-core/dist/domain";
import { Observable } from "rxjs";
import { SchemaHelper } from "@maxxton/microdocs-core/dist/helpers/schema/schema.helper";
import { ProjectClient } from "./project.client";
import { map } from "rxjs/operators";

/**
 * Client for the standalone implementation.
 * Uses static json files
 */
//@Client( {
//  serviceId: 'static',
//  baseUrl: "/data",
//  headers: {
//    'Accept': 'application/json',
//    'Content-Type': 'application/json'
//  }
//} )
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
//  @Get( "/projects-{env}.json" )
//  @Map( resp => ProjectTree.link( resp.json() ) )
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
//  @Get( "/projects/{title}-{env}-{version}.json" )
//  @Map( resp => SchemaHelper.resolveObject( resp.json() ) )
  public loadProject( /*@Path( "env", { value: 'default' } )*/ env: string, /*@Path( "title" )*/ title: string, /*@Path( "version" )*/ version?: string ): Observable<Project> {
    return this.http.get(`${this.baseUrl}/projects/${title}-${env}-${version}.json`).pipe(map(resp => SchemaHelper.resolveObject( resp )));
  }

  /**
   * Load all the environments
   * @httpResponse 200 {{[key:string]:Environments}} map of environments
   */
//  @Get( "/envs.json" )
//  @Map( resp => resp.json() )
  public getEnvs(): Observable<{ [key: string]: Environments }> {
    return this.http.get<{[key: string]: Environments}>(`${this.baseUrl}/envs.json`);
  }

  public importProject( env: string, project: Project, name: string, group: string, version: string ): Observable<ProblemResponse> {
    throw new Error( 'Import project is not supported in standalone' );
  }

  public deleteProject( env: string, name: string, version?: string ): Observable<any> {
    throw new Error( 'Delete project is not supported in standalone' );
  }

  public updateProject( env: string, name: string, rules: ProjectChangeRule[], version?: string ): Observable<any> {
    throw new Error( 'Update project is not supported in standalone' );
  }

  public reindex( env: string ): Observable<any> {
    throw new Error( 'Reindex is not supported in standalone' );
  }

}
