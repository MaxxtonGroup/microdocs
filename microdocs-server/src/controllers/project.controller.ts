import { Body, Get, JsonController, OnNull, Param, Post } from "routing-controllers";
import { Project, ProjectOptions } from "../domain/projects/project.model";
import { BaseController } from "./base.controller";

@JsonController("/api/v2")
export class ProjectController extends BaseController {

  /**
   * List all projects
   * @returns {Promise<Project[]>}
   */
  @Get("/projects")
  public getProjects(): Promise<Project[]> {
    return this.projectService.getProjects();
  }

  /**
   * Get a single project
   * @param {string} projectName
   * @returns {Promise<Project>}
   */
  @Get("/projects/:projectName")
  @OnNull(404)
  public getProject(@Param("projectName") projectName: string): Promise<Project> {
    return this.projectService.getProject(projectName);
  }

  /**
   * Create a project
   * @returns {Promise<Project>}
   */
  @Post("/projects")
  public createProject(@Body() projectOptions: ProjectOptions): Promise<Project> {
    return this.projectService.createProject(projectOptions);
  }


}