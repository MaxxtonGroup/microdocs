import {
  Get, Controller, Param, BadRequestError, QueryParam, NotFoundError, Post, Body,
  Put,
  Delete, Authorized,
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { Script } from "@maxxton/microdocs-core/domain";
import { Environment } from "../domain/environment.model";
import { ScriptService } from "../services/script.service";
import { OnUndefined } from "routing-controllers";
import { Patch } from "routing-controllers";
import { OpPatch, apply as jsonPatch } from "json-patch";
import { Validator, ValidatorResult } from "jsonschema";
import { SettingsService } from "../services/settings.service";
import { Roles } from "../security/roles";

@Service()
@Controller("/api/v2")
export class SettingsController {

  @Inject()
  private settingsService:SettingsService;
  @Inject()
  private scriptService:ScriptService;

  /**
   * Get list of all the script names for an environment
   * @param {string} envName
   * @returns {Promise<string[]>}
   */
  @Get("/scripts")
  @Authorized(Roles.EDIT)
  public async getScripts(@QueryParam( "env", { required: false } ) envName?: string):Promise<string[]> {
    let env = await this.getEnv( envName );
    return await this.scriptService.getScriptNames(env);
  }

  /**
   * Get a script
   * @param {string} name
   * @param {string} envName
   * @returns {Promise<Script>}
   */
  @Get("/scripts/:name")
  @Authorized(Roles.EDIT)
  public async getScript(@Param( "name" ) name: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<Script> {
    let env = await this.getEnv( envName );
    let script = await this.scriptService.getScript(env, name);
    if(!script){
      throw new NotFoundError( `Script '${name}' doesn't exists on environment '${env.name}'` );
    }
    return script;
  }

  /**
   * Create a script
   * @param script
   * @param {string} envName
   * @returns {Promise<Script>}
   */
  @Post("/scripts")
  @Authorized(Roles.EDIT)
  public async createScript(@Body({required:true}) script:Script, @QueryParam( "env", { required: false } ) envName?: string):Promise<Script> {
    let env = await this.getEnv( envName );

    // Validate
    let validationResult = this.validateScript(script);
    if ( !validationResult.valid ) {
      throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
    }

    return await this.scriptService.addScript(env, script);
  }

  /**
   * Update a script
   * @param script
   * @param name
   * @param {string} envName
   * @returns {Promise<Script>}
   */
  @Put("/scripts/:name")
  @Authorized(Roles.EDIT)
  public async updateScript(@Body({required:true}) script:Script, @Param( "name" ) name: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<Script> {
    let env = await this.getEnv( envName );
    script.name = name;

    // Validate
    let validationResult = this.validateScript(script);
    if ( !validationResult.valid ) {
      throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
    }

    return await this.scriptService.addScript(env, script);
  }

  /**
   * Patch a script
   * @param patches
   * @param name
   * @param {string} envName
   * @returns {Promise<Script>}
   */
  @Patch("/scripts/:name")
  @Authorized(Roles.EDIT)
  public async patchScript(@Body({required:true}) patches:OpPatch[], @Param( "name" ) name: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<Script> {
    let env = await this.getEnv( envName );
    // Find script
    let script = await this.scriptService.getScript(env, name);
    if(!script){
      throw new NotFoundError( `Script '${name}' doesn't exists on environment '${env.name}'` );
    }

    // Patch it
    try {
      jsonPatch(script, patches);
    }catch(e){
      throw new BadRequestError(`Could not patch script '${name}': ${e.message}`);
    }
    script.name = name;

    // Validate
    let validationResult = this.validateScript(script);
    if ( !validationResult.valid ) {
      throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
    }

    // Save
    return await this.scriptService.addScript(env, script);
  }

  /**
   * Delete a script
   * @param script
   * @param name
   * @param {string} envName
   * @returns {Promise<Script>}
   */
  @Delete("/scripts/:name")
  @OnUndefined( 204 )
  @Authorized(Roles.EDIT)
  public async deleteScript(@Param( "name" ) name: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<void> {
    let env = await this.getEnv( envName );
    let deleted = await this.scriptService.deleteScript(env, name);
    if ( !deleted ) {
      throw new NotFoundError( `Script '${name}' doesn't exists on environment '${env.name}'` );
    }
  }


  /**
   * Get the environment by name
   * @param {string} envName
   * @throws {BadRequestError} when the env doesn't exists or no default env is specified in the settings.json
   * @returns Environment
   */
  private async getEnv( envName?: string ): Promise<Environment> {
    let env = await this.settingsService.getEnv( envName );
    if ( !env ) {
      if ( envName ) {
        throw new BadRequestError( `environment '${envName}' doesn't exists, make sure it is specified in the settings` );
      } else {
        throw new BadRequestError( `No default environment specified, use the 'env' query parameter to explicit select an environment` );
      }
    }
    return env;
  }

  /**
   * Validate script
   * @param script
   * @return {string[]} validate issues
   */
  private validateScript( script: Script ): ValidatorResult {

    let validator   = new Validator();
    let schema: any = {
      "title": "A JSON Schema for MicroDocs Scripts 2.0 API.",
      "id": "http://microdocs.io/v2/schema-script.json#",
      "$schema": "http://json-schema.org/draft-04/schema#",
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "name": {
          "required": true,
          "type": "string",
          "description": "The name of the script"
        },
        "description": {
          "required": false,
          "type": "string",
          "description": "Description of the script"
        },
        "selectors": {
          "required": false,
          "type": "object",
          "description": "Selectors for when this script should be executed",
          "properties": {
            "title": {
              "required": false,
              "anyOf":[
                {
                  "type": "string"
                },
                {
                  "$ref": "#/definitions/Selector"
                }
              ]
            },
            "env": {
              "required": false,
              "anyOf":[
                {
                  "type": "string"
                },
                {
                  "$ref": "#/definitions/Selector"
                }
              ]
            },
            "group": {
              "required": false,
              "anyOf":[
                {
                  "type": "string"
                },
                {
                  "$ref": "#/definitions/Selector"
                }
              ]
            },
            "tag": {
              "required": false,
              "anyOf":[
                {
                  "type": "string"
                },
                {
                  "$ref": "#/definitions/Selector"
                }
              ]
            },
            "fields": {
              "required": false,
              "type": "object",
              "additionalProperties": {
                "anyOf":[
                  {
                    "type": "string"
                  },
                  {
                    "$ref": "#/definitions/Selector"
                  }
                ]
              }

            }
          }
        },
        "script": {
          "required": true,
          "type": "any"
        }
      },
      "definitions": {
        "Selector": {
          "type": "object"
        }
      }
    };

    // validate
    let result = validator.validate( script, schema );

    return result;
  }

}