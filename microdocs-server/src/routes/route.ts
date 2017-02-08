
import {RequestHandler, Request, Response, NextFunction} from 'express';
import {ProjectSettingsJsonRepository} from "../repositories/json/project-settings-json.repo";
import {Injection} from "../injections";
import { BaseResponseHandler } from "./responses/base-response.handler";
import { MicroDocsResponseHandler } from "./responses/microdocs-response.handler";
import { SwaggerResponseHandler } from "./responses/swagger-response.handler";
import { PostmanResponseHandler } from "./responses/postman-response.handler";
import { TemplateResponseHandler } from "./responses/template-response.handler";

const baseResponse = BaseResponseHandler;
const microDocsResponse = MicroDocsResponseHandler;
const swaggerResponse = SwaggerResponseHandler;
const postmanResponse = PostmanResponseHandler;

const responses:{[key:string]:new (injection:Injection)=>BaseResponseHandler} = {
  "default": baseResponse,
  "swagger": swaggerResponse,
  "microdocs": microDocsResponse,
  "postman": postmanResponse
};

/**
 * Base route
 * Adds mapping to the route itself
 */
export abstract class BaseRoute {
  
  constructor(public injection:Injection){}

  /**
   * The mapping of this route
   */
  mapping: RequestMapping;

  /**
   * Path of this route
   * @returns {string}
   */
  public path(): string {
    return this.mapping.path;
  }

  /**
   * List of request methods, eg. ['get', 'post']
   * @returns {string[]}
   */
  public methods(): string[] {
    return this.mapping.methods;
  }

  public getDefaultHandler():BaseResponseHandler{
    return new baseResponse(this.injection);
  }

  public getHandler(req: Request):BaseResponseHandler{
    var exportType = req.query.export;
    if(exportType == undefined){
      exportType = req.header('export');
      if(exportType == undefined){
        exportType = 'default';
      }
    }
    var response:new (injection:Injection)=>BaseResponseHandler = responses[exportType.toLowerCase()];
    if(response == undefined){
      return new TemplateResponseHandler(this.injection, exportType.toLowerCase());
    }
    return new response(this.injection);
  }

  /**
   * Function which handles the request
   * @returns {RequestHandler}
   */
  public handler(): (req: Request, res: Response, next: NextFunction, scope:BaseRoute) => any {
    return this.mapping.handler;
  }

  public upload(): boolean{
    return this.mapping.upload;
  }

  public getEnv(req:Request, scope:BaseRoute):string{
    var env = req.query.env;
    var envs = scope.injection.ProjectSettingsRepository().getEnvs();

    if(env == undefined){
      for(var envName in envs){
        if(envs[envName].default){
          return envName.toLowerCase();
        }
      }
      return Object.keys(envs)[0].toLowerCase();
    }else{
      for(var envName in envs){
        if(envName.toLowerCase() == env.toLowerCase()){
          return envName.toLowerCase();
        }
      }
    }
    return null;
  }

}

export interface RequestMapping {

  path: string;
  methods: string[];
  handler: (req: Request, res: Response, next: NextFunction, scope:BaseRoute) => any;
  upload?: boolean

}