import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import {
  RestClient,
  HttpClient,
  Get,
  Path,
  Query,
  Map,
  Produces, MediaType, Client
} from "@maxxton/angular-rest";
import { ProjectTree, Project, ProjectChangeRule, Settings, ProjectMetadata } from "@maxxton/microdocs-core/domain";
import { Observable } from "rxjs/Observable";
import { SchemaHelper } from "@maxxton/microdocs-core/helpers/schema/schema.helper";
import { ProjectClient } from "./project.client";
import { ProblemReport } from "@maxxton/microdocs-core/domain";

/**
 * Client for the standalone implementation.
 * Uses static json files
 */
@Client( {
  serviceId: 'static',
  baseUrl: "/data",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
} )
@Injectable()
export class StandaloneProjectClient extends RestClient implements ProjectClient {

  constructor( private http: Http ) {
    super( <any>http );
  }

  /**
   * Loads all projects
   * @httpPath env for which environment, default is the current one
   * @httpResponse 200 {TreeNode}
   */
  @Get( "/projects-{env}.json" )
  @Map( resp => resp.json() )
  public loadProjects( @Path( "env", { value: 'default' } ) env: string ): Observable<ProjectMetadata[]> {
    return null;
  }

  /**
   * Loads all projects
   * @httpPath env for which environment, default is the current one
   * @httpResponse 200 {TreeNode}
   */
  @Get( "/tree-{env}.json" )
  @Map( resp => ProjectTree.link( resp.json() ) )
  public loadTree( @Path( "env", { value: 'default' } ) env: string ): Observable<ProjectTree> {
    return null;
  }

  /**
   * Load project
   * @httpPath title name of the project
   * @httpPath tag specific tag, or if empty the latest
   * @httpPath env for which environment, default is the current one
   * @httpResponse 200 {Project}
   */
  @Get( "/projects/{title}-{env}-{tag}.json" )
  @Map( resp => SchemaHelper.resolveObject( resp.json() ) )
  public loadProject( @Path( "env", { value: 'default' } ) env: string, @Path( "title" ) title: string, @Path( "tag" ) tag?: string ): Observable<Project> {
    return null;
  }

  /**
   * Load all the environments
   * @httpResponse 200 {{[key:string]:Environments}} map of environments
   */
  @Get( "/settings.json" )
  @Map( resp => resp.json() )
  public getSettings(): Observable<Settings> {
    return null
  }

  public addProject( env: string, project: Project, name: string, tag: string ): Observable<Project> {
    throw new Error( 'Import project is not supported in standalone' );
  }

  public deleteProject( env: string, name: string, tag?: string ): Observable<Response> {
    throw new Error( 'Delete project is not supported in standalone' );
  }

  public updateProject( env: string, name: string, rules: ProjectChangeRule[], tag?: string ): Observable<Response> {
    throw new Error( 'Update project is not supported in standalone' );
  }

  public reindex( env: string ): Observable<Response> {
    throw new Error( 'Reindex is not supported in standalone' );
  }

  deleteDocument( env: string, title: string, tag: string ): Observable<Response> {
    throw new Error( 'Delete document is not supported in standalone' );
  }

  updateDocument( env: string, title: string, rules: ProjectChangeRule[], tag: string ): Observable<Response> {
    throw new Error( 'Update document is not supported in standalone' );
  }

  check( env: string, project: Project ): Observable<ProblemReport> {
    throw new Error( 'Check is not supported in standalone' );
  }

}
