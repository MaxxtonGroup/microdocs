import { ProjectRepository } from "../../../../repositories_old/project.repo";
import { ProjectTree, Project, Environments, ProjectSettings } from "@maxxton/microdocs-core/domain";
import { ProjectSettingsRepository } from "../../../../repositories_old/project-settings.repo";
import { Settings } from "../../../../domain/settings.model";
import { Metadata } from "../../../../domain/metadata.model";
/**
 * @author Steven Hermans
 */
export class ProjectSettingsRepositoryMock implements ProjectSettingsRepository {
  getMetadata(): Metadata {
    return {};
  }

  saveMetadata( metadata: Metadata ): void {
  }

  getSettings(): Settings {
    return { envs: { default: { default: true } } };
  }

  getProjectSettings(): ProjectSettings {
    return <ProjectSettings>{
      global: {},
      environments: {},
      groups: {},
      projects: {}
    };
  }


}