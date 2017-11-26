
import { BaseController } from "./base.controller";
import { Body, Get, JsonController, NotFoundError, OnNull, Param, Post } from "routing-controllers";
import { Repo, RepoOptions } from "../domain/repos/repo.model";

@JsonController("/api/v2")
export class RepoController extends BaseController {

  /**
   * List all repositories inside a project
   * @param {string} projectCode
   * @returns {Promise<Repo[]>}
   */
  @Get("/projects/:projectCode/repos")
  @OnNull(404)
  public async getRepositories(@Param("projectCode") projectCode:string): Promise<Repo[]> {
    let project = await this.projectService.getProject(projectCode);
    if(!project){
      throw new NotFoundError("Project '" + projectCode + "' doesn't exists");
    }

    let repoService = this.repoService(project);
    return repoService.getRepos();
  }

  /**
   * Get a repository inside a project
   * @param {string} projectCode
   * @param {string} repoCode
   * @returns {Promise<Repo>}
   */
  @Get("/projects/:projectCode/repos/:repoCode")
  @OnNull(404)
  public async getRepository(@Param("projectCode") projectCode:string, @Param("repoCode") repoCode:string): Promise<Repo> {
    let project = await this.projectService.getProject(projectCode);
    if(!project){
      throw new NotFoundError("Project '" + projectCode + "' doesn't exists");
    }

    let repoService = this.repoService(project);
    return repoService.getRepo(repoCode);
  }

  /**
   * Create a repository
   * @param {string} projectCode
   * @returns {Promise<Repo>}
   */
  @Post("/projects/:projectCode/repos")
  public async createRepository(@Param("projectCode") projectCode:string, @Body() repoOptions: RepoOptions): Promise<Repo> {
    let project = await this.projectService.getProject(projectCode);
    if(!project){
      throw new NotFoundError("Project '" + projectCode + "' doesn't exists");
    }

    return this.repoService(project).createRepo(repoOptions);
  }

}