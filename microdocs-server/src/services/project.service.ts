import { Inject, Service } from "typedi";
import { Environment } from "../domain/environment.model";
import { DependencyNode, Project, ProjectInfo, ProjectNode, ProjectTree } from "@maxxton/microdocs-core/domain";
import { DocumentRepository } from "../repositories/document.repo";
import { OpPatch, apply as applyPatch } from "json-patch";


@Service()
export class ProjectService {

  @Inject("projectRepository")
  private projectRepository: DocumentRepository;
  @Inject("reportRepository")
  private reportRepository: DocumentRepository;

  /**
   * Get the project tree
   * @param {Environment} env
   * @param {string[]} projectFilter
   * @param {string[]} groupFilter
   * @returns {Promise<ProjectTree>}
   */
  public async getProjectTree( env: Environment, projectFilter: string[], groupFilter: string[] ): Promise<ProjectTree> {
    let projectTree = await this.projectRepository.loadTree(env);
    console.info(projectTree)
    if(projectTree) {
      this.filterTree(projectTree, groupFilter, projectFilter);
    }
    return projectTree;
  }

  /**
   * Get list of project infos
   * @param {Environment} env
   * @returns {Promise<ProjectInfo[]>}
   */
  public async getProjectInfos( env: Environment ): Promise<ProjectInfo[]> {
    return this.projectRepository.loadIndexes(env);
  }

  /**
   * Get project info
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<ProjectInfo>}
   */
  public async getProjectInfo( env: Environment, title: string ): Promise<ProjectInfo> {
    return this.projectRepository.loadIndex(env, title);
  }

  /**
   * Get project
   * @param {Environment} env
   * @param {string} title
   * @param {string} version
   * @returns {Promise<Project>}
   */
  public async getProject( env: Environment, title: string, version?: string ): Promise<Project> {
    // Find latest version
    if (!version || version === 'latest') {
      let projectInfo = await this.projectRepository.loadIndex(env, title);
      if (!projectInfo || !projectInfo.version) {
        projectInfo = await this.reportRepository.loadIndex(env, title);
      }
      if (!projectInfo || !projectInfo.version) {
        return null;
      }
      version = projectInfo.version;
    }

    // Load document
    let project = await this.projectRepository.loadDocument(env, title, version);
    if (!project) {
      project = await this.reportRepository.loadDocument(env, title, version);
    }
    return project;
  }

  /**
   * Add project
   * @param {Environment} env
   * @param {Project} report
   * @returns {Promise<Project>}
   */
  public async addProject( env: Environment, report: Project ): Promise<Project> {
    report.info.publishTime = new Date().toISOString();
    delete report.info.versions;
    let storedReport = await this.reportRepository.storeDocument(env, report);

    // Update index
    let newIndex = storedReport.info;
    let oldIndex = await this.reportRepository.loadIndex(env, report.info.title);
    if (oldIndex) {
      newIndex.versions = oldIndex.versions;
      newIndex.versions.push(newIndex.version);
    } else {
      newIndex.versions = [newIndex.version];
    }
    await this.reportRepository.storeIndex(env, newIndex);

    return storedReport;
  }

  /**
   * Delete project
   * @param {Environment} env
   * @param {string} title
   * @param {string} version
   * @returns {Promise<boolean>}
   */
  public async deleteProject( env: Environment, title: string, version?: string ): Promise<boolean> {
    let reportIndex = await this.reportRepository.loadIndex(env, title);
    let projectIndex = await this.projectRepository.loadIndex(env, title);
    if (!reportIndex && !projectIndex) {
      return false;
    }
    await this.reportRepository.deleteIndex(env, title);
    await this.projectRepository.deleteIndex(env, title);
    await Promise.all(reportIndex.versions.map(version => this.reportRepository.deleteDocument(env, title, version)));
    await Promise.all(projectIndex.versions.map(version => this.reportRepository.deleteDocument(env, title, version)));
    return true;
  }

  /**
   * Patch all version of a project
   * @param {Environment} env
   * @param {OpPatch[]} patches List of JSON Patch objects (see http://jsonpatch.com/)
   * @param {string} title
   * @param {string} version version to patch, or all versions if not specified
   * @returns {Promise<ProjectInfo>}
   */
  public async patchProject( env: Environment, patches: OpPatch[], title: string ): Promise<ProjectInfo> {
    // Patch all versions
    let index = await this.reportRepository.loadIndex(env, title);
    if(!index || !index.versions){
      return null;
    }
    let promises = index.versions.map(version => this.patchProjectVersion(env, patches, title, version));
    await Promise.all(promises);
    return index;
  }

  /**
   * Patch project version
   * @param {Environment} env
   * @param {OpPatch[]} patches List of JSON Patch objects (see http://jsonpatch.com/)
   * @param {string} title
   * @param {string} version version to patch, or all versions if not specified
   * @returns {Promise<Project>}
   */
  public async patchProjectVersion( env: Environment, patches: OpPatch[], title: string, version: string ): Promise<Project> {
    // Patch one version
    let project = await this.reportRepository.loadDocument(env, title, version);
    if (!project) {
      return null;
    } else {
      let patchedProject = applyPatch(project, patches);
      await this.reportRepository.storeDocument(env, patchedProject);
      return patchedProject;
    }
  }

  /**
   * Filter groups and projects out of the tree
   * @param {ProjectTree} root
   * @param {string[]} groups
   * @param {string[]} projects
   * @returns {ProjectTree}
   */
  private filterTree( root: ProjectTree, groups: string[], projects: string[] ): ProjectTree {
    let removeProjects: ProjectNode[] = [];
    root.projects.forEach(project => {
      if (this.filterNode(project, groups, projects)) {
        removeProjects.push(project);
      } else {
        this.filterNodes(project, groups, projects);
      }
    });
    removeProjects.forEach(project => delete root.projects[root.projects.indexOf(project)]);

    return root;
  }

  /**
   * Filter groups and projects out of nodes from the tree
   * @param {ProjectNode} projectNode
   * @param {string[]} groups
   * @param {string[]} projects
   * @returns {ProjectNode}
   */
  private filterNodes( projectNode: ProjectNode, groups: string[], projects: string[] ): ProjectNode {
    let removeDependency: DependencyNode[] = [];
    projectNode.dependencies.forEach(dependency => {
      if (this.filterNode(dependency.item, groups, projects)) {
        removeDependency.push(dependency);
      } else {
        this.filterNode(dependency.item, groups, projects);
      }
    });
    removeDependency.forEach(dependency => delete projectNode.dependencies[projectNode.dependencies.indexOf(dependency)]);

    return projectNode;
  }

  /**
   * Filter groups and projects out of a node from the tree
   * @param {ProjectNode} project
   * @param {string[]} groups
   * @param {string[]} projects
   * @returns {boolean}
   */
  private filterNode( project: ProjectNode, groups: string[], projects: string[] ): boolean {
    let filter = false;

    // filter project
    projects.forEach(fTitle => {
      if (fTitle.indexOf('!') == 0) {
        //ignore
        fTitle = fTitle.substring(1);
        if (project.title == fTitle) {
          filter = true;
        }
      } else {
        //select
        if (project.title != fTitle) {
          filter = true;
        }
      }
    });

    // filter groups
    groups.forEach(group => {
      if (group.indexOf('!') == 0) {
        //ignore
        group = group.substring(1);
        if (project.group == group) {
          filter = true;
        }
      } else {
        //select
        if (project.group != group) {
          filter = true;
        }
      }
    });
    return filter;
  }
}

