
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

/**
 * Controller for managing templates of projects
 */
@Controller( "/api/v2" )
export class ProjectTemplateController {

  @Inject()
  private settingsService:SettingsService;
  @Inject()
  private projectService:ProjectService;
  @Inject()
  private templateService:TemplateService;

  /**
   * List templates for a project
   * @param {string} title
   * @param tag
   * @param {string} envName
   * @returns {Promise<string[]>}
   */
  @Get("/projects/:title/:tag/templates")
  public async getTemplateNames(@Param("title") title:string, @Param( "tag" ) tag: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<string[]>{
    let env = await this.getEnv(envName);
    // Get project
    let project = await this.projectService.getProject(env, title, tag);
    if ( !project ) {
      let projectMetadata = await this.projectService.getProjectMetadata( env, title );
      if ( !projectMetadata ) {
        throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
      } else {
        throw new NotFoundError( `Project '${title}:${tag}' doesn't exists on environment '${env.name}'` );
      }
    }
    // Get template names
    return await this.templateService.getTemplateNames(env, project);
  }

  /**
   * Get template for a project
   * @param {string} title
   * @param {string} tag
   * @param templateName
   * @param {string} envName
   * @returns {Promise<Template>}
   */
  @Get("/projects/:title/:tag/templates/:templateName")
  public async getTemplate(@Param("title") title:string, @Param( "tag" ) tag: string, @Param( "templateName" ) templateName: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<Template>{
    let env = await this.getEnv(envName);
    // Get project
    let project = await this.projectService.getProject(env, title, tag);
    if ( !project ) {
      let projectMetadata = await this.projectService.getProjectMetadata( env, title );
      if ( !projectMetadata ) {
        throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
      } else {
        throw new NotFoundError( `Project '${title}:${tag}' doesn't exists on environment '${env.name}'` );
      }
    }
    // Get template
    let template = await this.templateService.getTemplate(env, templateName, project);
    if(!template){
      throw new NotFoundError( `Template '${templateName}' doesn't exists on project '${title}'` );
    }
    return template;
  }

  /**
   * Create template for a project
   * @param {Template} template
   * @param {string} title
   * @param {string} tag
   * @param {string} envName
   * @returns {Promise<Template>}
   */
  @Post("/projects/:title/:tag/templates")
  public async createTemplates(@Body({required:true}) template:Template, @Param("title") title:string, @Param( "tag" ) tag: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<Template>{
    let env = await this.getEnv(envName);
    // Get project
    let project = await this.projectService.getProject(env, title, tag);
    if ( !project ) {
      let projectMetadata = await this.projectService.getProjectMetadata( env, title );
      if ( !projectMetadata ) {
        throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
      } else {
        throw new NotFoundError( `Project '${title}:${tag}' doesn't exists on environment '${env.name}'` );
      }
    }

    // Validate template
    let validationResult = this.validateTemplate(template);
    if ( !validationResult.valid ) {
      throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
    }

    // Create template
    return await this.templateService.createTemplate(env, template, project);
  }

  /**
   * Edit template for a project
   * @param {Template} template
   * @param {string} title
   * @param {string} tag
   * @param templateName
   * @param {string} envName
   * @returns {Promise<Template>}
   */
  @Put("/projects/:title/:tag/templates/:templateName")
  public async updateTemplate(@Body({required:true}) template:Template, @Param("title") title:string, @Param( "tag" ) tag: string, @Param( "templateName" ) templateName: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<Template>{
    let env = await this.getEnv(envName);
    template.name = templateName;

    // Get project
    let project = await this.projectService.getProject(env, title, tag);
    if ( !project ) {
      let projectMetadata = await this.projectService.getProjectMetadata( env, title );
      if ( !projectMetadata ) {
        throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
      } else {
        throw new NotFoundError( `Project '${title}:${tag}' doesn't exists on environment '${env.name}'` );
      }
    }

    // Validate template
    let validationResult = this.validateTemplate(template);
    if ( !validationResult.valid ) {
      throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
    }

    // Create template
    return await this.templateService.updateTemplate(env, template, project);
  }

  /**
   * Patch a template
   * @param patches
   * @param title
   * @param tag
   * @param templateName
   * @param {string} envName
   * @returns {Promise<Template>}
   */
  @Patch("/projects/:title/:tag/templates/:templateName")
  public async patchTemplate(@Body({required:true}) patches:OpPatch[],@Param("title") title:string, @Param( "tag" ) tag: string, @Param( "templateName" ) templateName: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<Template> {
    let env = await this.getEnv( envName );
    // Get project
    let project = await this.projectService.getProject(env, title, tag);
    if ( !project ) {
      let projectMetadata = await this.projectService.getProjectMetadata( env, title );
      if ( !projectMetadata ) {
        throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
      } else {
        throw new NotFoundError( `Project '${title}:${tag}' doesn't exists on environment '${env.name}'` );
      }
    }
    // Get template
    let template = await this.templateService.getTemplate(env, templateName, project);
    if(!template){
      throw new NotFoundError( `Template '${templateName}' doesn't exists on project '${title}'` );
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
    return await this.templateService.updateTemplate(env, template, project);
  }

  /**
   * Delete template for a project
   * @param {string} title
   * @param {string} tag
   * @param templateName
   * @param {string} envName
   */
  @Delete("/projects/:title/:tag/templates/:templateName")
  @OnUndefined( 204 )
  public async deleteTemplates(@Param("title") title:string, @Param( "tag" ) tag: string, @Param( "templateName" ) templateName: string, @QueryParam( "env", { required: false } ) envName?: string):Promise<void>{
    let env = await this.getEnv(envName);
    // Get project
    let project = await this.projectService.getProject(env, title, tag);
    if ( !project ) {
      let projectMetadata = await this.projectService.getProjectMetadata( env, title );
      if ( !projectMetadata ) {
        throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
      } else {
        throw new NotFoundError( `Project '${title}:${tag}' doesn't exists on environment '${env.name}'` );
      }
    }
    // Get template
    let deleted = await this.templateService.deleteTemplate(env, templateName, project);
    if(!deleted){
      throw new NotFoundError( `Template '${templateName}' doesn't exists on project '${title}'` );
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