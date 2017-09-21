
import {
  BadRequestError, Body, Controller, Get, NotFoundError, Param, Post, Put,
  QueryParam
  Delete,
} from "routing-controllers";
import { Environment } from "../domain/environment.model";
import { Inject } from "typedi";
import { SettingsService } from "../services/settings.service";
import { ProjectService } from "../../dist/services/project.service";
import { OnUndefined } from "routing-controllers";
import { Patch } from "routing-controllers";
import { OpPatch, apply as jsonPatch } from "json-patch";
import { Authorized } from "routing-controllers";
import { Roles } from "../security/roles";

/**
 * Controller for managing global templates
 */
@Controller( "/api/v2" )
export class TemplateController {

  @Inject()
  private settingsService:SettingsService;
  @Inject()
  private templateService:TemplateService;

  /**
   * List global templates
   * @param {string} envName
   * @returns {Promise<string[]>}
   */
  @Get("/templates")
  @Authorized(Roles.VIEW)
  public async getTemplateNames(@QueryParam( "env", { required: false } ) envName?: string):Promise<string[]>{
    let env = await this.getEnv(envName);

    // Get template names
    return await this.templateService.getTemplateNames(env);
  }

  /**
   * Get global template
   * @param templateName
   * @param {string} envName
   * @returns {Promise<Template>}
   */
  @Get("/templates/:templateName")
  @Authorized(Roles.VIEW)
  public async getTemplates(@Param( "templateName" ) templateName: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<Template>{
    let env = await this.getEnv(envName);

    // Get template
    let template = await this.templateService.getTemplate(env, templateName);
    if(!template){
      throw new NotFoundError( `Template '${templateName}' doesn't exists on environment '${env.name}'` );
    }
    return template;
  }

  /**
   * Create global template
   * @param {Template} template
   * @param {string} envName
   * @returns {Promise<Template>}
   */
  @Post("/templates")
  @Authorized(Roles.PUBLISH)
  public async createTemplates(@Body({required:true}) template:Template, @QueryParam( "env", { required: false } ) envName?: string):Promise<Template>{
    let env = await this.getEnv(envName);

    // Validate template
    let validationResult = this.validateTemplate(template);
    if ( !validationResult.valid ) {
      throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
    }

    // Create template
    return await this.templateService.createTemplate(env, template);
  }

  /**
   * Edit global template
   * @param {Template} template
   * @param templateName
   * @param {string} envName
   * @returns {Promise<Template>}
   */
  @Put("/templates/:templateName")
  @Authorized(Roles.EDIT)
  public async updateTemplate(@Body({required:true}) template:Template, @Param( "templateName" ) templateName: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<Template>{
    let env = await this.getEnv(envName);
    template.name = templateName;

    // Validate template
    let validationResult = this.validateTemplate(template);
    if ( !validationResult.valid ) {
      throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
    }

    // Create template
    return await this.templateService.updateTemplate(env, template);
  }

  /**
   * Patch a global template
   * @param patches
   * @param templateName
   * @param {string} envName
   * @returns {Promise<Template>}
   */
  @Patch("/templates/:templateName")
  @Authorized(Roles.EDIT)
  public async patchTemplate(@Body({required:true}) patches:OpPatch[], @Param( "templateName" ) templateName: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<Template> {
    let env = await this.getEnv( envName );

    // Get template
    let template = await this.templateService.getTemplate(env, templateName);
    if(!template){
      throw new NotFoundError( `Template '${templateName}' doesn't exists on environment '${env.name}'` );
    }

    // Patch it
    try {
      jsonPatch(template, patches);
    }catch(e){
      throw new BadRequestError(`Could not patch template '${name}': ${e.message}`);
    }
    template.name = templateName;

    // Validate
    let validationResult = this.validateTemplate(template);
    if ( !validationResult.valid ) {
      throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
    }

    // Save template
    return await this.templateService.updateTemplate(env, template);
  }

  /**
   * Delete global template
   * @param templateName
   * @param {string} envName
   */
  @Delete("/templates/:templateName")
  @OnUndefined( 204 )
  @Authorized(Roles.EDIT)
  public async deleteTemplates(@Param( "templateName" ) templateName: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<void>{
    let env = await this.getEnv(envName);

    // Get template
    let deleted = await this.templateService.deleteTemplate(env, templateName);
    if(!deleted){
      throw new NotFoundError( `Template '${templateName}' doesn't exists on environment '${env.name}'` );
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
   * Validate template
   * @param {Template} template
   * @return {ValidatorResult} validate issues
   */
  private validateTemplate( template: Template ): ValidatorResult {

  }

}