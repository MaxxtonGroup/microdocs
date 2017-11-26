
import { ValidationError } from "validator.ts/ValidationError";
import { Project, ProjectOptions } from "./project.model";
import { ProjectRepository } from "./project.repository";

/**
 * Manage Projects
 */
export class ProjectService {

  constructor(private projectRepository: ProjectRepository) {

  }

  /**
   * Create new Project
   * @param {ProjectOptions} projectOptions
   */
  public async createProject(projectOptions: ProjectOptions): Promise<Project> {
    // Create project
    let project = new Project(projectOptions);

    // Validate project
    project.validate();
    if (await this.existsProject(projectOptions.code)) {
      throw new ValidationError([
        {
          property: "code",
          errorCode: 0,
          errorName: "Not Unique",
          errorMessage: "Project code '" + project.code + "' is already used",
          value: project.code,
          required: true,
          objectClass: null
        }]);
    }

    // Save and return project
    return await this.projectRepository.save(project);
  }

  /**
   * Edit properties of a project
   * @param {string} projectCode
   * @param {ProjectOptions} projectOptions
   * @returns {project}
   */
  public async editProject(projectCode: string, projectOptions: ProjectOptions): Promise<Project | null> {
    // Find project
    let project = await this.projectRepository.findById(projectCode);
    if (!project) {
      return null;
    }

    // Edit properties
    project.edit(projectOptions);
    if (projectCode.toLowerCase() !== projectCode.toLowerCase()) {
      if (await this.existsProject(projectOptions.code)) {
        throw new ValidationError([
          {
            property: "code",
            errorCode: 0,
            errorName: "Not Unique",
            errorMessage: "Project code '" + project.code + "' is already used",
            value: project.code,
            required: true,
            objectClass: null
          }]);
      }
    }

    // Save and return project
    return await this.projectRepository.save(project);
  }

  /**
   * Get project by project code
   * @param {string} projectCode
   * @returns {project}
   */
  public getProject(projectCode: string): Promise<Project | null> {
    return this.projectRepository.findById(projectCode);
  }

  /**
   * Check if a project already exists
   * @param {string} projectCode
   * @returns {boolean}
   */
  public async existsProject(projectCode: string): Promise<boolean> {
    return await this.getProject(projectCode) !== null;
  }

  /**
   * Get all Projects
   * @returns {Promise<Project[]>}
   */
  public async getProjects(): Promise<Project[]> {
    return this.projectRepository.findAll();
  }

}