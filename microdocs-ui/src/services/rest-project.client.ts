import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import {
    Get, Path, Put, Patch, Query, Body, Map, Produces, MediaType, Client, Delete,
    RestClient
} from "@maxxton/angular2-rest";
import { ProjectTree, Project, Environments, ProjectChangeRule, ProblemResponse } from "@maxxton/microdocs-core/domain";
import { Observable } from "rxjs/Observable";
import { SchemaHelper } from "@maxxton/microdocs-core/helpers/schema/schema.helper";
import { SnackbarService } from "@maxxton/components/services/snackbar.service";
import { ProjectClient } from "./project.client";

/**
 * Client for integration with the microdocs-server implementation.
 * Uses the Rest api of the microdocs-server
 */
@Client( {
  serviceId: 'microdocs-server',
  baseUrl: "/api/v1",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
} )
@Injectable()
export class RestProjectClient extends RestClient implements ProjectClient {

  constructor( private http:Http ) {
    super(http);
  }

  /**
   * Loads all projects
   * @httpQuery env for which environment, default is the current one
   * @httpResponse 200 {TreeNode}
   */
  @Get( "/projects" )
  @Map( resp => ProjectTree.link( resp.json() ) )
  public loadProjects( @Query( "env" ) env:string ):Observable<ProjectTree> {
    return null;
  }

  /**
   * Load project
   * @httpPath title name of the project
   * @httpQuery version specific version, or if empty the latest
   * @httpQuery env for which environment, default is the current one
   * @httpBody body {Project}
   * @httpResponse 200 {Project}
   */
  @Get( "/projects/{title}" )
  @Map( resp => SchemaHelper.resolveObject( resp.json() ) )
  public loadProject( @Query( "env" ) env:string, @Path( "title" ) title:string, @Query( "version" ) version?:string ):Observable<Project> {
    return null;
  }

  /**
   * Load all the environments
   * @httpResponse 200 {{[key: string]: Environments}}
   */
  @Get( "/envs" )
  @Map( resp => resp.json() )
  public getEnvs():Observable<{[key:string]:Environments}> {
    return null
  }

  @Put( "/projects/{title}" )
  @Map( resp => resp.json() )
  public importProject( @Query( "env" ) env:string, @Body project:Project, @Path( "title" ) name:string, @Query( "group" ) group:string, @Query( "version" ) version:string ):Observable<ProblemResponse> {
    return null;
  }

  @Delete( "/projects/{title}" )
  public deleteProject( @Query( 'env' ) env:string, @Path( 'title' ) name:string, @Query( 'version' ) version?:string ):Observable<Response> {
    return null;
  }

  @Patch( "/projects/{title}" )
  public updateProject( @Query( 'env' ) env:string, @Path( 'title' ) name:string, @Body rules:ProjectChangeRule[], @Query( 'version' ) version?:string ):Observable<Response> {
    return null;
  }

  @Put( "/reindex" )
  reindex( @Query( 'env' ) env:string ):Observable<Response> {
    return null;
  }

}