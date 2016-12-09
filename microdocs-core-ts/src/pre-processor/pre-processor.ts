import { Project } from "../domain/project.model";
import { ProjectSettings } from "../domain/settings/project-settings.model";
/**
 * @author Steven Hermans
 */
export interface PreProcessor{

  processProject(settings: ProjectSettings, project: Project, env: string): Project;

}