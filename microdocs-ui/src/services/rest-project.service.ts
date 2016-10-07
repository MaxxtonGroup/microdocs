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
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";
import {NewyseConfig as config} from "../config/config";
import {ProjectService} from "./project.service";

@Client({
    serviceId: 'microdocs-server', 
    baseUrl: config.apipath, 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  }})
@Injectable()
export class RestProjectService extends RestClient implements ProjectService{

  private env:string;

  constructor(private http:Http){
    super(http);
  }

  @Get("projects")
  @Map(resp => TreeNode.link(resp.json()))
  public getProjects(@Query("env") env: string = this.getSelectedEnv()): Observable<TreeNode>{return null;}


  @Get("projects/{projectName}")
  @Map(resp => SchemaHelper.resolveObject(resp.json()))
  public getProject(@Path("projectName") projectName:string, @Query("version") version?:string, @Query("env") env: string = this.getSelectedEnv()): Observable<Project>{return null;}

  @Get("envs")
  @Map(resp => resp.json())
  public getEnvs(): Observable<{[key:string]:Environments}> {return null}

  public setSelectedEnv(env: string) {
    this.env = env;
  }

  public getSelectedEnv(): string {
    return this.env;
  }

}