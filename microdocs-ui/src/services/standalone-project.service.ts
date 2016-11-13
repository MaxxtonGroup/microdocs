import { ProjectService } from "./project.service";
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
} from "@maxxton/angular2-rest";
import { ProjectTree, Project, Environments, ProjectChangeRule } from "@maxxton/microdocs-core/domain";
import { Observable } from "rxjs/Observable";
import { SchemaHelper } from "@maxxton/microdocs-core/helpers/schema/schema.helper";
import { SnackbarService } from "@maxxton/components/services/snackbar.service";

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
export class StandaloneProjectService extends ProjectService {

  constructor( private http:Http, private snackbarService:SnackbarService ) {
    super( http, snackbarService );
  }

  /**
   * Loads all projects
   * @httpPath env for which environment, default is the current one
   * @httpResponse 200 {TreeNode}
   */
  @Get( "/projects-{env}.json" )
  @Map( resp => ProjectTree.link( resp.json() ) )
  public loadProjects( @Path( "env" ) env:string = this.getSelectedEnv() ):Observable<ProjectTree> {
    return null;
  }

  /**
   * Load project
   * @httpPath title name of the project
   * @httpPath version specific version, or if empty the latest
   * @httpPath env for which environment, default is the current one
   * @httpResponse 200 {Project}
   */
  @Get( "/projects/{title}-{env}-{version}.json" )
  @Map( resp => SchemaHelper.resolveObject( resp.json() ) )
  public loadProject( @Path( "projectName" ) projectName:string, @Path( "version" ) version?:string, @Path( "env" ) env:string = this.getSelectedEnv() ):Observable<Project> {
    return null;
  }

  /**
   * Load all the environments
   * @httpResponse 200 {{[key:string]:Environments}} map of environments
   */
  @Get( "/envs.json" )
  @Map( resp => resp.json() )
  public getEnvs():Observable<{[key:string]:Environments}> {
    return null
  }

  importProject( project:Project, name:string, group:string, version:string, env?:string ):Observable<Response> {
    throw new Error( 'Import project is not supported in standalone' );
  }

  deleteProject( name:string, version?:string, env?:string ):Observable<Response> {
    throw new Error( 'Delete project is not supported in standalone' );
  }

  updateProject( name:string, rules:ProjectChangeRule[], version?:string, env?:string ):Observable<Response> {
    throw new Error( 'Update project is not supported in standalone' );
  }

  reindex( env?:string ):Observable<Response> {
    throw new Error( 'Reindex is not supported in standalone' );
  }

}