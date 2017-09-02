import {
  BadRequestError, Get, JsonController, QueryParam, Param, Post, Body, Put, Delete,
  OnUndefined,
  Patch, NotFoundError,
} from "routing-controllers";
import { Inject } from "typedi";
import { Project, ProjectInfo, ProjectTree } from "@maxxton/microdocs-core/domain";
import { SettingsService } from "../services/settings.service";
import { Environment } from "../domain/environment.model";
import { ProjectService } from "../services/project.service";
import { OpPatch } from "json-patch";

@JsonController("/api/v2")
export class ProjectController {


  @Inject()
  private projectService: ProjectService;
  @Inject()
  private settingsService: SettingsService;

  /**
   * List of projects info
   * @param {string} envName
   * @returns {Promise<ProjectInfo[]>}
   */
  @Get("/projects")
  public async getProjects( @QueryParam("env", { required: false }) envName?: string ): Promise<ProjectInfo[]> {
    let env = await this.getEnv(envName);
    return await this.projectService.getProjectInfos(env);
  }

  /**
   * Get project tree
   * @param {string} envName
   * @param {string} projectFilter
   * @param {string} groupFilter
   * @returns {Promise<ProjectTree>}
   */
  @Get("/projects/tree")
  public async getProjectTree( @QueryParam("env", { required: false }) envName?: string, @QueryParam("projects", { required: false }) projectFilter?: string, @QueryParam("groups", { required: false }) groupFilter?: string ): Promise<ProjectTree> {
    let env = await this.getEnv(envName);
    let tree = await this.projectService.getProjectTree(env, projectFilter ? projectFilter.split(",") : [], groupFilter ? groupFilter.split(",") : []);
    if(!tree){
      throw new NotFoundError(`Environment '${env.name}' is not indexed yet, try to index it using: POST /api/v2/projects/reindex?env=${env.name}`)
    }
    return tree;
  }

  /**
   * Get project info
   * @param {string} title
   * @param {string} envName
   * @returns {Promise<ProjectInfo>}
   */
  @Get("/projects/:title")
  public async getProjectInfo( @Param("title") title: string, @QueryParam("env", { required: false }) envName?: string ): Promise<ProjectInfo> {
    let env = await this.getEnv(envName);
    let projectInfo = await this.projectService.getProjectInfo(env, title);
    if (!projectInfo) {
      throw new NotFoundError(`Project '${title}' doesn't exists on environment '${env.name}'`);
    }
    return projectInfo;
  }

  /**
   * Get version of project
   * @param {string} title
   * @param {string} envName
   * @param {string} version version of the project or 'latest' for the latest version
   * @returns {Promise<Project>}
   */
  @Get("/projects/:title/:version")
  public async getProjectByVersion( @Param("title") title: string, @Param("version") version: string, @QueryParam("env", { required: false }) envName?: string ): Promise<Project> {
    let env = await this.getEnv(envName);
    let project = await this.projectService.getProject(env, title, version);
    if (!project) {
      let projectInfo = await this.projectService.getProjectInfo(env, title);
      if (!projectInfo) {
        throw new NotFoundError(`Project '${title}' doesn't exists on environment '${env.name}'`);
      } else {
        throw new NotFoundError(`Project '${title}:${version}' doesn't exists on environment '${env.name}'`);
      }
    }
    return project;
  }

  /**
   * Store new project
   * @param {Project} report
   * @param {string} title
   * @param {string} version
   * @param {string} envName
   * @returns {Promise<Project>}
   */
  @Put("/project/:title/:version")
  public async storeProject( @Body() report: Project | any, @Param("title") title: string, @Param("version") version: string, @QueryParam("env", { required: false }) envName?: string ): Promise<Project> {
    if (!report.info) {
      report.info = {};
    }
    if (title) {
      report.info.title = title;
    }
    if (version) {
      report.info.version = version;
    }

    let env = await this.getEnv(envName);
    return await this.projectService.addProject(env, report);
  }

  /**
   * Delete project
   * @param {string} title
   * @param {string} envName
   * @returns {Promise<void>}
   */
  @Delete("/project/:title")
  @OnUndefined(204)
  public async deleteProject( @Param("title") title: string, @QueryParam("env", { required: false }) envName?: string ): Promise<void> {
    let env = await this.getEnv(envName);
    let deleted = await this.projectService.deleteProject(env, title);
    if(!deleted){
      throw new NotFoundError(`Project '${title}' doesn't exists on environment '${env.name}'`);
    }
  }

  /**
   * Delete version of project
   * @param {string} title
   * @param {string} version version of the project or 'latest' for the latest version
   * @param {string} envName
   * @returns {Promise<void>}
   */
  @Delete("/project/:title/:version")
  @OnUndefined(204)
  public async deleteProjectVersion( @Param("title") title: string, @Param("version") version: string, @QueryParam("env", { required: false }) envName?: string ): Promise<void> {
    let env = await this.getEnv(envName);
    let deleted = await this.projectService.deleteProject(env, title, version);
    if (deleted) {
      throw new NotFoundError(`Project '${title}' doesn't exists on environment '${env.name}'`);
    }
  }

  /**
   * Patch all versions of a project
   * @param {string} title
   * @param {OpPatch[]} patches List of JSON Patch objects (see http://jsonpatch.com/)
   * @param {string} envName
   * @returns {Promise<ProjectInfo>}
   */
  @Patch("/project/:title")
  public async patchProject( @Body() patches: OpPatch[], @Param("title") title: string, @QueryParam("env", { required: false }) envName?: string ): Promise<ProjectInfo> {
    let env = await this.getEnv(envName);
    let projectInfo = await this.projectService.patchProject(env, patches, title);
    if (!projectInfo) {
      throw new NotFoundError(`Project '${title}' doesn't exists on environment '${env.name}'`);
    }
    return projectInfo;
  }

  /**
   * Patch project version
   * @param {string} title
   * @param {string} version version of the project or 'latest' for the latest version
   * @param {OpPatch[]} patches List of JSON Patch objects (see http://jsonpatch.com/)
   * @param {string} envName
   * @returns {Promise<Project>}
   */
  @Patch("/project/:title/:version")
  public async patchProjectVersion( @Body() patches: OpPatch[], @Param("title") title: string, @Param("version") version: string, @QueryParam("env", { required: false }) envName?: string ): Promise<Project> {
    let env = await this.getEnv(envName);
    let project = await this.projectService.patchProjectVersion(env, patches, title, version);
    if (!project) {
      let projectInfo = await this.projectService.getProjectInfo(env, title);
      if (!projectInfo) {
        throw new NotFoundError(`Project '${title}' doesn't exists on environment '${env.name}'`);
      } else {
        throw new NotFoundError(`Project '${title}:${version}' doesn't exists on environment '${env.name}'`);
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
    let env = await this.settingsService.getEnv(envName);
    if (!env) {
      if (envName) {
        throw new BadRequestError(`environment '${envName}' doesn't exists, make sure it is specified in the settings`);
      } else {
        throw new BadRequestError(`No default environment specified, use the 'env' query parameter to explicit select an environment`);
      }
    }
    return env;
  }

}