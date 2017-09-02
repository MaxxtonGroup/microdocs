import * as yaml from "js-yaml";
import * as fs from "fs";
import * as pathUtil from "path";
import * as mkdirp from "mkdirp";
import { Project, ProjectInfo, ProjectTree } from "@maxxton/microdocs-core/domain";
import { LoggerFactory } from "@webscale/logging";
import { Environment } from "../../domain/environment.model";
import { DocumentRepository } from "../document.repo";

const logger = LoggerFactory.create();

const INDEX_FILE = "_index";
const TREE_FILE = "_tree";
const YAML_EXT = ".yml";

/**
 * Store documents on the filesystem using YAML structured files
 */
export class DocumentYamlRepository implements DocumentRepository {

  private readonly dataFolder: string;

  constructor(dataFolder: string) {
    this.dataFolder = dataFolder;
  }

  /**
   * Store project tree
   * @param {Environment} env
   * @param {ProjectTree} tree
   * @returns {Promise<ProjectTree>}
   */
  public storeTree(env: Environment, tree: ProjectTree): Promise<ProjectTree> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = this.getTreePath(env);
        logger.silly("store tree: " + filePath);

        let yamlDocument = yaml.safeDump(tree);
        this.makeParentDir(filePath).then(() => {
          fs.writeFile(filePath, yamlDocument, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(tree);
            }
          });
        }).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Load project tree
   * @param {Environment} env
   * @returns {Promise<ProjectTree>}
   */
  public loadTree(env: Environment): Promise<ProjectTree> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = this.getTreePath(env);
        logger.silly("load tree: " + filePath);

        fs.exists(filePath, exists => {
          if (exists) {
            fs.readFile(filePath, (err, data) => {
              if (err) {
                reject(err);
              } else {
                let tree = yaml.safeLoad(data.toString()) as ProjectTree;
                resolve(tree);
              }
            });
          } else {
            resolve(null);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Delete project tree
   * @param {Environment} env
   * @returns {Promise<boolean>}
   */
  public deleteTree(env: Environment): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        let filePath = this.getTreePath(env);
        logger.silly("delete tree: " + filePath);

        fs.exists(filePath, exists => {
          if (exists) {
            fs.unlink(filePath, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
          } else {
            resolve(false);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Store document
   * @param {Environment} env
   * @param {Project} document
   * @returns {Promise<Project>}
   */
  public storeDocument(env: Environment, document: Project): Promise<Project> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = this.getDocumentPath(env, document);
        logger.silly("store document: " + filePath);

        let yamlDocument = yaml.safeDump(document);
        this.makeParentDir(filePath).then(() => {
          fs.writeFile(filePath, yamlDocument, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(document);
            }
          });
        }).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Load document
   * @param {Environment} env
   * @param {string} title
   * @param {string} version
   * @returns {Promise<Project>}
   */
  public loadDocument(env: Environment, title: string, version: string): Promise<Project> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = this.getPath(env, title, version);
        logger.silly("load document: " + filePath);

        fs.exists(filePath, exists => {
          if (exists) {
            fs.readFile(filePath, (err, data) => {
              if (err) {
                reject(err);
              } else {
                let document = yaml.safeLoad(data.toString()) as Project;
                resolve(document);
              }
            });
          } else {
            resolve(null);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Delete document
   * @param {Environment} env
   * @param {string} title
   * @param {string} version
   * @returns {Promise<boolean>}
   */
  public deleteDocument(env: Environment, title: string, version: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        let filePath = this.getPath(env, title, version);
        logger.silly("delete document: " + filePath);

        fs.exists(filePath, exists => {
          if (exists) {
            fs.unlink(filePath, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
          } else {
            resolve(false);
          }
        });
      } catch (e) {
        reject(e);
      }
    }).then((deleted) => {
      this.deleteDir(env, title).then();
      return Promise.resolve(deleted);
    });
  }

  /**
   * Store document index
   * @param {Environment} env
   * @param {ProjectInfo} index
   * @returns {Promise<ProjectInfo>}
   */
  public storeIndex(env: Environment, index: ProjectInfo): Promise<ProjectInfo> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = this.getPath(env, index.title, INDEX_FILE);
        logger.silly("store index: " + filePath);

        let yamlDocument = yaml.safeDump(index);
        this.makeParentDir(filePath).then(() => {
          fs.writeFile(filePath, yamlDocument, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(index);
            }
          });
        }).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Load document index
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<ProjectInfo>}
   */
  public loadIndex(env: Environment, title: string): Promise<ProjectInfo> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = this.getPath(env, title, INDEX_FILE);
        logger.silly("load index: " + filePath);

        fs.exists(filePath, (exists) => {
          if (exists) {
            fs.readFile(filePath, (err, data) => {
              if (err) {
                reject(err);
              } else {
                let index = yaml.safeLoad(data.toString()) as ProjectInfo;
                resolve(index);
              }
            });
          } else {
            resolve(null);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Load all document indexes
   * @param {Environment} env
   * @returns {Promise<ProjectInfo[]>}
   */
  public loadIndexes(env: Environment): Promise<ProjectInfo[]> {
    return new Promise((resolve, reject) => {
      try {
        let folder = this.resolvePath(env.name);
        fs.exists(folder, exists => {
          if (exists) {
            fs.readdir(folder, (err, folderNames) => {
              if (err) {
                reject(err);
              } else {
                let promisses = folderNames.map(title => {
                  return this.loadIndex(env, title);
                });
                Promise.all(promisses).then(indexes => {
                  resolve(indexes.filter(index => index));
                }).catch(reject);
              }
            });
          } else {
            resolve([]);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Delete document index
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<ProjectInfo>}
   */
  public deleteIndex(env: Environment, title: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        let filePath = this.getPath(env, title, INDEX_FILE);
        logger.silly("delete index: " + filePath);

        fs.exists(filePath, (exists) => {
          if (exists) {
            fs.unlink(filePath, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
          } else {
            resolve(false);
          }
        });
      } catch (e) {
        reject(e);
      }
    }).then((deleted) => {
      this.deleteDir(env, title).then();
      return Promise.resolve(deleted);
    });
  }

  /**
   * Remove directory if empty
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<void>}
   */
  private deleteDir(env: Environment, title: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        let folder = this.resolvePath(pathUtil.join(env.name, title));
        fs.rmdir(folder, (err) => {
          resolve();
        });
      } catch (e) {
        logger.warn("Error while deleting dir for '" + env + "/" + title + "'", e);
        resolve();
      }
    });
  }

  /**
   * Get the absolute path for the tree
   * @param {Environment} env
   * @returns {string}
   */
  private getTreePath(env: Environment): string {
    return this.resolvePath(pathUtil.join(env.name, TREE_FILE + YAML_EXT));
  }

  /**
   * Get the absolute path of a document
   * @param {Environment} env
   * @param {Project} document
   * @returns {string}
   */
  private getDocumentPath(env: Environment, document: Project): string {
    this.validateDocument(document);
    return this.getPath(env, document.info.title, document.info.version);
  }

  /**
   * Get the absolute path
   * @param {Environment} env
   * @param {string} title
   * @param {string} version
   * @returns {string}
   */
  private getPath(env: Environment, title: string, version: string) {
    return this.resolvePath(
      pathUtil.join(env.name.toLowerCase(), title.toLowerCase(), version.toLowerCase() + YAML_EXT));
  }

  /**
   * Validate if document title and version are correct
   * @param {Project} document
   */
  private validateDocument(document: Project): void {
    if (!document) {
      throw new Error("Missing document");
    }
    if (!document.info.title) {
      throw new Error("Title of the document is missing");
    }
    if (!document.info.version) {
      throw new Error("Version of the document is missing");
    }
    if (document.info.version.toLowerCase() === "_index") {
      throw new Error("Invalid version: " + document.version);
    }
  }

  /**
   * Get absolute path of a file
   * @param {string} path
   * @returns {string}
   */
  private resolvePath(path: string): string {
    return pathUtil.resolve(process.cwd(), this.dataFolder, path);
  }

  /**
   * Create parent folder of a path
   * @param {string} path
   * @returns {string}
   */
  private makeParentDir(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let dir = pathUtil.parse(path).dir;
      mkdirp(dir, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

}