import {ProjectService} from "./project.service";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {
  RestClient,
  HttpClient,
  Get,
  Path,
  Query,
  Map,
  Produces, MediaType, Client
} from "angular2-rest/angular2-rest";
import {TreeNode, Project, Environments} from "microdocs-core-ts/dist/domain";
import {Observable} from "rxjs/Observable";
import {SchemaHelper} from "../../../microdocs-core-ts/dist/helpers/schema/schema.helper";

/**
 * Client for the standalone implementation.
 * Uses static json files
 */
@Client({
    serviceId: 'static', 
    baseUrl: "/data", 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  }})
@Injectable()
export class StandaloneProjectService extends ProjectService{

  constructor(private http:Http){
    super(http);
  }
  /**
   * Loads all projects
   * @param env for which environment, default is the current one
   * @returns projects
   */
  @Get("/projects-{env}.json")
  @Map(resp => TreeNode.link(resp.json()))
  public loadProjects(@Path("env") env: string = this.getSelectedEnv()): Observable<TreeNode>{return null;}

  /**
   * Load project
   * @param title name of the project
   * @param version specific version, or if empty the latest
   * @param env for which environment, default is the current one
   * @returns project
   */
  @Get("/projects/{projectName}-{env}-{version}.json")
  @Map(resp => SchemaHelper.resolveObject(resp.json()))
  public getProject(@Path("projectName") projectName:string, @Path("version") version?:string, @Path("env") env: string = this.getSelectedEnv()): Observable<Project>{return null;}

  /**
   * Load all the environments
   * @returns map of environments
   */
  @Get("/envs.json")
  @Map(resp => resp.json())
  public getEnvs(): Observable<{[key:string]:Environments}> {return null}
  
  importProject(project:Project, name:string, group:string, version:string, env?:string):Observable {
    return null;
  }

}