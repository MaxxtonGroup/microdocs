import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import {
  Get, Path, Put, Patch, Query, Body, Map, Produces, MediaType, Client, Delete,
  RestClient, HttpClient, Post
} from "@maxxton/angular-rest";
import { ProjectTree, Project, ProjectChangeRule, ProblemReport, Settings, ProjectMetadata } from "@maxxton/microdocs-core/domain";
import { Observable } from "rxjs/Observable";
import { SchemaHelper } from "@maxxton/microdocs-core/helpers/schema/schema.helper";
import { ProjectClient } from "./project.client";

/**
 * Client for integration with the microdocs-server implementation.
 * Uses the Rest api of the microdocs-server
 */
@Client( {
  serviceId: 'microdocs-server',
  baseUrl: "/api/v2",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
} )
@Injectable()
export class RestProjectClient extends RestClient implements ProjectClient {

  constructor( private http:Http ) {
    super(<any>http);
  }

  /**
   * Loads all projects
   * @httpQuery env for which environment, default is the current one
   * @httpResponse 200 {TreeNode}
   */
  @Get( "/projects" )
  @Map( resp => resp.json() )
  public loadProjects( @Query( "env" ) env:string ):Observable<ProjectMetadata[]> {
    return null;
  }

  /**
   * Loads all projects
   * @httpQuery env for which environment, default is the current one
   * @httpResponse 200 {TreeNode}
   */
  @Get( "/tree" )
  @Map( resp => ProjectTree.link( resp.json() ) )
  public loadTree( @Query( "env" ) env:string ):Observable<ProjectTree> {
    return null;
  }

  /**
   * Load project
   * @httpPath title name of the project
   * @httpQuery tag specific tag, or if empty the latest
   * @httpQuery env for which environment, default is the current one
   * @httpBody body {Project}
   * @httpResponse 200 {Project}
   */
  @Get( "/projects/{title}/{tag}" )
  @Map( resp => SchemaHelper.resolveObject( resp.json() ) )
  public loadProject( @Query( "env" ) env:string, @Path( "title" ) title:string, @Path( "tag" ) tag:string ):Observable<Project> {
    return null;
  }

  /**
   * Load all the environments
   * @httpResponse 200 {Settings}
   */
  @Get( "/settings" )
  @Map( resp => resp.json() )
  public getSettings():Observable<Settings> {
    return null
  }

  @Put( "/projects/{title}/{tag}" )
  @Map( resp => resp.json() )
  public addProject( @Query( "env" ) env:string, @Body project:Project, @Path( "title" ) name:string, @Path( "tag" ) tag:string ):Observable<Project> {
    return null;
  }

  @Delete( "/projects/{title}" )
  public deleteProject( @Query( 'env' ) env:string, @Path( 'title' ) name:string ):Observable<Response> {
    return null;
  }

  @Delete( "/projects/{title}/{tag}" )
  public deleteDocument( @Query( 'env' ) env:string, @Path( 'title' ) name:string, @Path( 'tag' ) tag:string ):Observable<Response> {
    return null;
  }

  @Patch( "/projects/{title}" )
  public updateProject( @Query( 'env' ) env:string, @Path( 'title' ) name:string, @Body rules:ProjectChangeRule[] ):Observable<Response> {
    return null;
  }

  @Patch( "/projects/{title}/{tag}" )
  public updateDocument( @Query( 'env' ) env:string, @Path( 'title' ) name:string, @Body rules:ProjectChangeRule[], @Path( 'tag' ) tag?:string ):Observable<Response> {
    return null;
  }

  @Post( "/reindex" )
  public reindex( @Query( 'env' ) env:string ):Observable<Response> {
    return null;
  }

  @Post( "/check" )
  public check( @Query( 'env' ) env:string, @Body project:Project ):Observable<ProblemReport> {
    return null;
  }

}
