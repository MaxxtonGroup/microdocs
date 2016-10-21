/// <reference path="../_all.d.ts" />

import {RequestHandler, Request, Response, NextFunction} from 'express';
import {ProjectSettingsJsonRepository} from "../repositories/json/project-settings-json.repo";
import {Injection} from "../injections";

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