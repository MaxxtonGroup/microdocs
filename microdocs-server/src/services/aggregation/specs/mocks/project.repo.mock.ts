import { ProjectRepository } from "../../../../repositories/project.repo";
import { ProjectTree, Project } from "@maxxton/microdocs-core/dist/domain";
/**
 * @author Steven Hermans
 */
export class ProjectRepositoryMock implements ProjectRepository {

  private projectTree: {[env: string]: ProjectTree} = {};
  private projectStore: {[env: string]: {[title: string]: {[version: string]: Project}}} = {};

  getAggregatedProjects( env: string ): ProjectTree {
    return this.projectTree[env];
  }

  getAggregatedProject( env: string, title: string, version: string ): Project {
    if (this.projectStore[env] && this.projectStore[env][title] && this.projectStore[env][title][version]) {
      return this.projectStore[env][title][version];
    }
    return null;
  }

  storeAggregatedProjects( env: string, projectTree: ProjectTree ): void {
    this.projectTree[env] = projectTree;
  }

  storeAggregatedProject( env: string, project: Project ): void {
    if (!this.projectStore[env]) {
      this.projectStore[env] = {};
    }
    if (!this.projectStore[env][project.info.title]) {
      this.projectStore[env][project.info.title] = {};
    }
    this.projectStore[env][project.info.title][project.info.version] = project;
  }

  removeAggregatedProject( env: string, title: string, version?: string ): boolean {
    if (this.projectStore[env] && this.projectStore[env][title] && this.projectStore[env][title][version]) {
      delete this.projectStore[env][title][version];
      return true;
    }
    return false;
  }

}
