import { ProjectRepository } from "../../../../repositories/project.repo";
import { ProjectTree, Project, ProjectInfo } from "@maxxton/microdocs-core/domain";
import { ReportRepository } from "../../../../repositories/report.repo";
/**
 * @author Steven Hermans
 */
export class ReportRepositoryMock implements ReportRepository {

  private projectStore: {[env: string]: {[title: string]: {[version: string]: Project}}} = {};

  constructor(projectStore: {[env: string]: {[title: string]: {[version: string]: Project}}}) {
    this.projectStore = projectStore;
  }

  getProjects( env: string ): Array<ProjectInfo> {
    const list: Array<ProjectInfo> = [];
    if (this.projectStore[env]) {
      for (const title in this.projectStore[env]) {
        const versions = Object.keys(this.projectStore[env][title]).sort();
        const version = versions[versions.length - 1];
        const project = this.projectStore[env][title][version];
        const info = new ProjectInfo(title, project.info.group, version, versions);
        list.push(info);
      }
    }
    return list;
  }

  getProject( env: string, info: ProjectInfo ): Project {
    if (this.projectStore[env] && this.projectStore[env][info.title] && this.projectStore[env][info.title][info.version]) {
      return this.projectStore[env][info.title][info.version];
    }
    return null;
  }

  storeProject( env: string, project: Project ): void {
    if (!this.projectStore[env]) {
      this.projectStore[env] = {};
    }
    if (!this.projectStore[env][project.info.title]) {
      this.projectStore[env][project.info.title] = {};
    }
    this.projectStore[env][project.info.title][project.info.version] = project;
  }

  removeProject( env: string, info: ProjectInfo ): boolean {
    if (this.projectStore[env] && this.projectStore[env][info.title] && this.projectStore[env][info.title][info.version]) {
      delete this.projectStore[env][info.title][info.version];
      return true;
    }
    return false;
  }



}
