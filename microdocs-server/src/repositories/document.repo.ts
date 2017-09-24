import { Project, ProjectMetadata, ProjectTree } from "@maxxton/microdocs-core/domain";
import { Environment } from "@maxxton/microdocs-core/domain";

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
   * @param {string} title
   * @param {Project} document
   * @returns {Promise<Project>}
   */
  storeDocument( env: Environment, title:string, document: Project ): Promise<Project>;

  /**
   * Load document
   * @param {Environment} env
   * @param {string} title
   * @param {string} id
   * @returns {Promise<Project>}
   */
  loadDocument( env: Environment, title: string, id: string ): Promise<Project>;

  /**
   * Load all document ids
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<string[]>}
   */
  loadDocuments(env:Environment, title:string) :Promise<string[]>;

  /**
   * Delete document
   * @param {Environment} env
   * @param {string} title
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  deleteDocument( env: Environment, title: string, id: string ): Promise<boolean>;

  /**
   * Save document index
   * @param {Environment} env
   * @param {ProjectMetadata} index
   * @returns {Promise<ProjectMetadata>}
   */
  storeIndex( env: Environment, index: ProjectMetadata ): Promise<ProjectMetadata>;

  /**
   * Load document index
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<ProjectMetadata>}
   */
  loadIndex( env: Environment, title: string ): Promise<ProjectMetadata>;

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
   * @returns {Promise<ProjectMetadata[]>}
   */
  loadIndexes(env:Environment) :Promise<ProjectMetadata[]>;

}