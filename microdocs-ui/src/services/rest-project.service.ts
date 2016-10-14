import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Get, Path, Query,  Map, Produces, MediaType, Client, OnEmit} from "angular2-rest/angular2-rest";
import {TreeNode, Project, Environments} from "microdocs-core-ts/dist/domain";
import {Observable} from "rxjs/Observable";
import {SchemaHelper} from "../../../microdocs-core-ts/dist/helpers/schema/schema.helper";
import {ProjectService} from "./project.service";

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

  private env: string;

  constructor(private http: Http) {
    super(http);
  }

  /**
   * Loads all projects
   * @httpQuery env for which environment, default is the current one
   * @httpResponse 200 {TreeNode}
   */
  @Get("/projects")
  @Map(resp => TreeNode.link(resp.json()))
  @Map(resp => TreeNode.link(resp.json()))
  public getProjects(@Query("env") env: string = this.getSelectedEnv()): Observable<TreeNode> {
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
  @Get("/projects/{title}")
  @Map(resp => SchemaHelper.resolveObject(resp.json()))
  @OnEmit(obs => obs.map(resp => SchemaHelper.resolveObject(resp.json())))
  public getProject(@Path("title") title: string, @Query("version") version?: string, @Query("env") env: string = this.getSelectedEnv()): Observable<Project> {
    return null;
  }

  /**
   * Load all the environments
   * @httpResponse 200 {{[key: string]: Environments}}
   */
  @Get("/envs")
  @Map(resp => resp.json())
  public getEnvs(): Observable<{[key: string]: Environments}> {
    return null
  }

  public setSelectedEnv(env: string) {
    this.env = env;
  }

  public getSelectedEnv(): string {
    return this.env;
  }

}