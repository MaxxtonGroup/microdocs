import {
  BadRequestError, Get, Controller, QueryParam, Param, Post, Body, Put, Delete,
  OnUndefined,
  Patch, NotFoundError
} from "routing-controllers";
import { Inject } from "typedi";
import { Project, ProjectMetadata, ProjectTree, ProblemReport } from "@maxxton/microdocs-core/domain";
import { SettingsService } from "../services/settings.service";
import { Environment } from "@maxxton/microdocs-core/domain";
import { ProjectService } from "../services/project.service";
import { OpPatch } from "json-patch";
import { Validator, ValidatorResult } from "jsonschema";
import { IndexService } from "../services/index.service";

/**
 * Controller for managing projects and tags
 */
@Controller( "/api/v2" )
export class ProjectController {


  @Inject()
  private projectService: ProjectService;
  @Inject()
  private settingsService: SettingsService;
  @Inject()
  private indexService: IndexService;

  /**
   * List of projects
   * @param {string} envName
   * @returns {Promise<ProjectMetadata[]>}
   */
  @Get( "/projects" )
  public async getProjects( @QueryParam( "env", { required: false } ) envName?: string ): Promise<ProjectMetadata[]> {
    let env = await this.getEnv( envName );
    return await this.projectService.getProjectMetadatas( env );
  }

  /**
   * Get project tree
   * @param {string} envName
   * @param {string} projectFilter
   * @param {string} groupFilter
   * @returns {Promise<ProjectTree>}
   */
  @Get( "/tree" )
  public async getProjectTree( @QueryParam( "env", { required: false } ) envName?: string, @QueryParam( "projects", { required: false } ) projectFilter?: string, @QueryParam( "groups", { required: false } ) groupFilter?: string ): Promise<any> {
    let env  = await this.getEnv( envName );
    let tree = await this.projectService.getProjectTree( env, projectFilter ? projectFilter.split( "," ) : [], groupFilter ? groupFilter.split( "," ) : [] );
    if ( !tree ) {
      throw new NotFoundError( `Environment '${env.name}' is not indexed yet, try to index it using: POST /api/v2/projects/reindex?env=${env.name}` )
    }
    return tree.unlink();
  }

  /**
   * Reindex an environment
   * @param envName
   * @return {Promise<ProjectTree>}
   */
  @Post( "/reindex" )
  public async reindex( @QueryParam( "env", { required: false } ) envName?: string ): Promise<ProblemReport> {
    let env = await this.getEnv( envName );
    return this.indexService.startIndexing( env );
  }

  /**
   * Check a document for problems
   * @param document
   * @param envName
   * @return {Promise<ProblemReport>}
   */
  @Post( "/check" )
  public async checkDocument( @Body() document: Project, @QueryParam( "env", { required: false } ) envName?: string ): Promise<ProblemReport> {
    let env = await this.getEnv( envName );

    // Validate new report
    let validationResult = this.validateReport_2_0( document );
    if ( !validationResult.valid ) {
      throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
    } else {
      // Check document
      return this.projectService.checkDocument(env, document);
    }
  }

  /**
   * Get project metadata
   * @param {string} title
   * @param {string} envName
   * @returns {Promise<ProjectMetadata>}
   */
  @Get( "/projects/:title" )
  public async getProjectMetadata( @Param( "title" ) title: string, @QueryParam( "env", { required: false } ) envName?: string ): Promise<ProjectMetadata> {
    let env             = await this.getEnv( envName );
    let projectMetadata = await this.projectService.getProjectMetadata( env, title );
    if ( !projectMetadata ) {
      throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
    }
    return projectMetadata;
  }

  /**
   * Get a project
   * @param {string} title
   * @param {string} envName
   * @param {string} tag tag of the project or 'latest' for the latest one
   * @returns {Promise<Project>}
   */
  @Get( "/projects/:title/:tag" )
  public async getProjectByTag( @Param( "title" ) title: string, @Param( "tag" ) tag: string, @QueryParam( "env", { required: false } ) envName?: string ): Promise<Project> {
    let env     = await this.getEnv( envName );
    let project = await this.projectService.getProject( env, title, tag );
    if ( !project ) {
      let projectMetadata = await this.projectService.getProjectMetadata( env, title );
      if ( !projectMetadata ) {
        throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
      } else {
        throw new NotFoundError( `Project '${title}:${tag}' doesn't exists on environment '${env.name}'` );
      }
    }
    return project;
  }

  /**
   * Store a new project
   * @param {Project} report
   * @param {string} title
   * @param {string} tag
   * @param {string} from
   * @param {string} envName
   * @param fromEnvName
   * @param opaque
   * @returns {Promise<Project>}
   */
  @Post( "/projects/:title" )
  public async storeProject( @Body( { required: false } ) report: Project,
                             @Param( "title" ) title: string,
                             @QueryParam( "tag", { required: false } ) tag?: string,
                             @QueryParam( "from", { required: false } ) from?: string,
                             @QueryParam( "env", { required: false } ) envName?: string,
                             @QueryParam( "fromEnv", { required: false } ) fromEnvName?: string,
                             @QueryParam( "opaque", { required: false } ) opaque?: boolean ): Promise<Project> {
    let env = await this.getEnv( envName );

    if ( report && Object.keys( report ).length > 0 && from ) {
      throw new BadRequestError( `'from' cannot be used in combination with a body. The 'from' option is used to promote an existing tag with a new tag` );
    }

    if ( from ) {
      // Promote report
      let fromEnv = env;
      if ( fromEnvName && fromEnvName.toLowerCase() !== envName.toLowerCase() ) {
        fromEnv = await this.getEnv( fromEnvName );
      }
      let newReport = await this.projectService.addTag( env, title, from, fromEnv, tag, opaque );
      if ( !newReport ) {
        throw new BadRequestError( `Tag '${from}' doesn't exists for project '${title}'` );
      }
      return newReport;
    } else if ( report ) {
      // Validate new report
      let validationResult = this.validateReport_2_0( report );
      if ( !validationResult.valid ) {
        throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
      } else {
        // Store project
        return await this.projectService.addProject( env, report, title, tag );
      }
    } else {
      throw new BadRequestError( `Request body is missing` );
    }
  }

  /**
   * Replace a project
   * @param {Project} report
   * @param {string} title
   * @param {string} tag
   * @param {string} envName
   * @returns {Promise<Project>}
   */
  @Put( "/projects/:title/:tag" )
  public async overwriteProject( @Body() report: Project | any, @Param( "title" ) title: string, @QueryParam( "tag" ) tag: string, @QueryParam( "env", { required: false } ) envName?: string ): Promise<Project> {
    let env = await this.getEnv( envName );

    // Validate new report
    let validationResult = this.validateReport_2_0( report );
    if ( !validationResult.valid ) {
      throw new BadRequestError( <any>validationResult.errors.map( error => (error as any).stack ) );
    } else {
      // Store project
      return await this.projectService.addProject( env, report, title, tag );
    }
  }

  /**
   * Delete project
   * @param {string} title
   * @param {string} envName
   * @returns {Promise<void>}
   */
  @Delete( "/projects/:title" )
  @OnUndefined( 204 )
  public async deleteProject( @Param( "title" ) title: string, @QueryParam( "env", { required: false } ) envName?: string ): Promise<void> {
    let env     = await this.getEnv( envName );
    let deleted = await this.projectService.deleteProject( env, title );
    if ( !deleted ) {
      throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
    }
  }

  /**
   * Remove tag from project
   * @param {string} title
   * @param {string} tag tag to remove
   * @param {string} envName
   * @returns {Promise<void>}
   */
  @Delete( "/projects/:title/:tag" )
  @OnUndefined( 204 )
  public async deleteProjectTag( @Param( "title" ) title: string, @Param( "tag" ) tag: string, @QueryParam( "env", { required: false } ) envName?: string ): Promise<void> {
    let env     = await this.getEnv( envName );
    let deleted = await this.projectService.deleteTag( env, title, tag );
    if ( !deleted ) {
      throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
    }
  }

  /**
   * Patch all tags of a project
   * @param {string} title
   * @param {OpPatch[]} patches List of JSON Patch objects (see http://jsonpatch.com/)
   * @param {string} envName
   * @returns {Promise<ProjectMetadata>}
   */
  @Patch( "/projects/:title" )
  public async patchProject( @Body() patches: OpPatch[], @Param( "title" ) title: string, @QueryParam( "env", { required: false } ) envName?: string ): Promise<ProjectMetadata> {
    let env             = await this.getEnv( envName );
    let projectMetadata = await this.projectService.patchProject( env, patches, title );
    if ( !projectMetadata ) {
      throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
    }
    return projectMetadata;
  }

  /**
   * Patch project tag
   * @param {string} title
   * @param {string} tag tag of the project or 'latest' for the latest tag
   * @param {OpPatch[]} patches List of JSON Patch objects (see http://jsonpatch.com/)
   * @param {string} envName
   * @returns {Promise<Project>}
   */
  @Patch( "/projects/:title/:tag" )
  public async patchProjectTag( @Body() patches: OpPatch[], @Param( "title" ) title: string, @Param( "tag" ) tag: string, @QueryParam( "env", { required: false } ) envName?: string ): Promise<Project> {
    let env     = await this.getEnv( envName );
    let project = await this.projectService.patchProjectTag( env, patches, title, tag );
    if ( !project ) {
      let projectMetadata = await this.projectService.getProjectMetadata( env, title );
      if ( !projectMetadata ) {
        throw new NotFoundError( `Project '${title}' doesn't exists on environment '${env.name}'` );
      } else {
        throw new NotFoundError( `Project '${title}:${tag}' doesn't exists on environment '${env.name}'` );
      }
    }
    return project;
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
   * Validate report
   * @param report
   * @return {string[]} validate issues
   */
  private validateReport_2_0( report: Project ): ValidatorResult {

    let validator   = new Validator();
    let schema: any = {
      "title": "A JSON Schema for MicroDocs 2.0 API.",
      "id": "http://microdocs.io/v2/schema.json#",
      "$schema": "http://json-schema.org/draft-04/schema#",
      "type": "object",
      "required": [
        "microdocs"
      ],
      "additionalProperties": true,
      "patternProperties": {
        "^x-": {
          "$ref": "#/definitions/vendorExtension"
        }
      },
      "properties": {
        "microdocs": {
          "type": "string",
          "enum": [
            "2.0"
          ],
          "description": "The MicroDocs version of this document."
        }
      },
      "definitions": {
        "vendorExtension": {
          "description": "Any property starting with x- is valid.",
          "additionalProperties": true,
          "additionalItems": true
        }
      }
    };

    // validate
    let result = validator.validate( report, schema );

    return result;
  }

}