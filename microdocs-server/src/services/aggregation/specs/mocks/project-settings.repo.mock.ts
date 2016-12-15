import { ProjectRepository } from "../../../../repositories/project.repo";
import { ProjectTree, Project, Environments, ProjectSettings } from "@maxxton/microdocs-core/domain";
import { ProjectSettingsRepository } from "../../../../repositories/project-settings.repo";
/**
 * @author Steven Hermans
 */
export class ProjectSettingsRepositoryMock implements ProjectSettingsRepository {

  getEnvs(): {[p: string]: Environments} {
    return { default: { default: true } };
  }

  getSettings(): ProjectSettings {
    return <ProjectSettings>{
      global: {},
      environments: {},
      groups: {},
      projects: {}
    };
  }


}