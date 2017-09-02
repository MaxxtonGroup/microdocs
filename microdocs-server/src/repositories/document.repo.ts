import { Project, ProjectInfo, ProjectTree } from "@maxxton/microdocs-core/domain";
import { Environment } from "../domain/environment.model";

export interface DocumentRepository {

  /**
   * Store project tree
   * @param {Environment} env
   * @param {ProjectTree} tree
   * @returns {Promise<ProjectTree>}
   */
  storeTree( env: Environment, tree: ProjectTree ): Promise<ProjectTree>;

  /**
   * Load project tree
   * @param {Environment} env
   * @returns {Promise<ProjectTree>}
   */
  loadTree( env: Environment ): Promise<ProjectTree>;

  /**
   * Delete project tree
   * @param {Environment} env
   * @returns {Promise<boolean>}
   */
  deleteTree( env: Environment ): Promise<boolean>;

  /**
   * Store document
   * @param {Environment} env
   * @param {Project} document
   * @returns {Promise<Project>}
   */
  storeDocument( env: Environment, document: Project ): Promise<Project>;

  /**
   * Load document
   * @param {Environment} env
   * @param {string} title
   * @param {string} version
   * @returns {Promise<Project>}
   */
  loadDocument( env: Environment, title: string, version: string ): Promise<Project>;

  /**
   * Delete document
   * @param {Environment} env
   * @param {string} title
   * @param {string} version
   * @returns {Promise<boolean>}
   */
  deleteDocument( env: Environment, title: string, version: string ): Promise<boolean>;

  /**
   * Save document index
   * @param {Environment} env
   * @param {ProjectInfo} index
   * @returns {Promise<ProjectInfo>}
   */
  storeIndex( env: Environment, index: ProjectInfo ): Promise<ProjectInfo>;

  /**
   * Load document index
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<ProjectInfo>}
   */
  loadIndex( env: Environment, title: string ): Promise<ProjectInfo>;

  /**
   * Delete document index
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<boolean>}
   */
  deleteIndex( env: Environment, title: string ): Promise<boolean>;

  /**
   * Load all document indexes
   * @param {Environment} env
   * @returns {Promise<ProjectInfo[]>}
   */
  loadIndexes(env:Environment) :Promise<ProjectInfo[]>;

}