import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Get, Path, Put, Patch, Query, Body,  Map, Produces, MediaType, Client, Delete} from "angular2-rest/angular2-rest";
import {TreeNode, Project, Environments, ProjectChangeRule} from "microdocs-core-ts/dist/domain";
import {Observable} from "rxjs/Observable";
import {SchemaHelper} from "../../../microdocs-core-ts/dist/helpers/schema/schema.helper";
import {ProjectService} from "./project.service";
import {SnackbarService} from "@maxxton/components/services/snackbar.service";

/**
 * Client for integration with the microdocs-server implementation.
 * Uses the Rest api of the microdocs-server
 */
@Client({
  serviceId: 'microdocs-server',
  baseUrl: "/api/v1",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
@Injectable()
export class RestProjectService extends ProjectService {

  constructor(private http: Http, private snackbarService:SnackbarService) {
    super(http, snackbarService);
  }

  /**
   * Loads all projects
   * @param env for which environment, default is the current one
   * @returns projects
   */
  @Get("/projects")
  @Map(resp => TreeNode.link(resp.json()))
  public loadProjects(@Query("env") env: string = this.getSelectedEnv()): Observable<TreeNode> {
    return null;
  }

  /**
   * Load project
   * @param title name of the project
   * @param version specific version, or if empty the latest
   * @param env for which environment, default is the current one
   * @returns project
   */
  @Get("/projects/{title}")
  @Map(resp => SchemaHelper.resolveObject(resp.json()))
  public loadProject(@Path("title") title: string, @Query("version") version?: string, @Query("env") env: string = this.getSelectedEnv()): Observable<Project> {
    return null;
  }

  /**
   * Load all the environments
   * @returns map of environments
   */
  @Get("/envs")
  @Map(resp => resp.json())
  public getEnvs(): Observable<{[key: string]: Environments}> {
    return null
  }
  
  @Put("/projects/{title}")
  public importProject(@Body project:Project, @Path("title") name:string, @Query("group") group:string, @Query("version") version:string, @Query("env") env:string = this.getSelectedEnv()):Observable {
    return null;
  }
  
  @Delete("/projects/{title}")
  public deleteProject(@Path('title') name:string, @Query('version') version?:string, @Query('env') env:string = this.getSelectedEnv()):Observable<Response>{
    return null;
  }
  
  @Patch("/projects/{title}")
  public updateProject(@Path('title') name:string, @Body rules:ProjectChangeRule[], @Query('version') version?:string, @Query('env') env?:string = this.getSelectedEnv()):Observable<Response> {
    return null;
  }

}