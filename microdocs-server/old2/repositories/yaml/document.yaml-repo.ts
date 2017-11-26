import * as yaml from "js-yaml";
import * as fs from "fs";
import * as pathUtil from "path";
import * as mkdirp from "mkdirp";
import { Project, ProjectMetadata, ProjectTree } from "@maxxton/microdocs-core/domain";
import { LoggerFactory } from "@webscale/logging";
import { Environment } from "@maxxton/microdocs-core/domain";
import { DocumentRepository } from "../document.repo";
import { v4 as uuid } from "uuid";
import { DEFAULT_FULL_SCHEMA } from "js-yaml";

const logger = LoggerFactory.create();

const INDEX_FILE = "_index";
const TREE_FILE  = "_tree";
const YAML_EXT   = ".yml";

/**
 * Store documents on the filesystem using YAML structured files
 */
export class DocumentYamlRepository implements DocumentRepository {

  private readonly dataFolder: string;

  constructor( dataFolder: string ) {
    this.dataFolder = dataFolder;
  }

  /**
   * Store project tree
   * @param {Environment} env
   * @param {ProjectTree} tree
   * @returns {Promise<ProjectTree>}
   */
  public storeTree( env: Environment, tree: ProjectTree ): Promise<ProjectTree> {
    return new Promise( ( resolve, reject ) => {
      try {
        let filePath = this.getTreePath( env );
        logger.silly( "store tree: " + filePath );

        let unlinkedTree = tree.unlink();
        let yamlDocument = yaml.safeDump( unlinkedTree, {schema: DEFAULT_FULL_SCHEMA } );
        this.makeParentDir( filePath ).then( () => {
          fs.writeFile( filePath, yamlDocument, ( err ) => {
            if ( err ) {
              reject( err );
            } else {
              resolve( tree );
            }
          } );
        } ).catch( reject );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Load project tree
   * @param {Environment} env
   * @returns {Promise<ProjectTree>}
   */
  public loadTree( env: Environment ): Promise<ProjectTree> {
    return new Promise( ( resolve, reject ) => {
      try {
        let filePath = this.getTreePath( env );
        logger.silly( "load tree: " + filePath );

        fs.exists( filePath, exists => {
          if ( exists ) {
            fs.readFile( filePath, ( err, data ) => {
              if ( err ) {
                reject( err );
              } else {
                let unlinkedTree = yaml.safeLoad( data.toString(), {schema: DEFAULT_FULL_SCHEMA } ) as ProjectTree;
                let tree = ProjectTree.link(unlinkedTree);
                resolve( tree );
              }
            } );
          } else {
            resolve( null );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Delete project tree
   * @param {Environment} env
   * @returns {Promise<boolean>}
   */
  public deleteTree( env: Environment ): Promise<boolean> {
    return new Promise<boolean>( ( resolve, reject ) => {
      try {
        let filePath = this.getTreePath( env );
        logger.silly( "delete tree: " + filePath );

        fs.exists( filePath, exists => {
          if ( exists ) {
            fs.unlink( filePath, ( err ) => {
              if ( err ) {
                reject( err );
              } else {
                resolve( true );
              }
            } );
          } else {
            resolve( false );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Store document
   * @param {Environment} env
   * @param {string} title
   * @param {Project} document
   * @returns {Promise<Project>}
   */
  public storeDocument( env: Environment, title: string, document: Project ): Promise<Project> {
    return new Promise( ( resolve, reject ) => {
      this.generateId( env, title ).then( generatedId => {
        try {
          document.id = generatedId;
          let filePath = this.getPath( env, title, generatedId );
          logger.silly( "store document: " + filePath );

          let yamlDocument = yaml.safeDump( document, {schema: DEFAULT_FULL_SCHEMA } );
          this.makeParentDir( filePath ).then( () => {
            fs.writeFile( filePath, yamlDocument, ( err ) => {
              if ( err ) {
                reject( err );
              } else {
                resolve( document );
              }
            } );
          } ).catch( reject );
        } catch ( e ) {
          reject( e );
        }
      } ).catch( reject );
    } );
  }

  /**
   * Load document
   * @param {Environment} env
   * @param {string} title
   * @param {string} id
   * @returns {Promise<Project>}
   */
  public loadDocument( env: Environment, title: string, id: string ): Promise<Project> {
    return new Promise( ( resolve, reject ) => {
      try {
        let filePath = this.getPath( env, title, id );
        logger.silly( "load document: " + filePath );

        fs.exists( filePath, exists => {
          if ( exists ) {
            fs.readFile( filePath, ( err, data ) => {
              if ( err ) {
                reject( err );
              } else {
                let document = yaml.safeLoad( data.toString(), {schema: DEFAULT_FULL_SCHEMA } ) as Project;
                resolve( document );
              }
            } );
          } else {
            resolve( null );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Load all document ids
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<string[]>}
   */
  public loadDocuments( env: Environment, title: string ): Promise<string[]> {
    return new Promise( ( resolve, reject ) => {
      try {
        let folder = this.resolvePath( pathUtil.join( env.name.toLowerCase(), title.toLowerCase() ) );
        fs.exists( folder, exists => {
          if ( exists ) {
            fs.readdir( folder, ( err, fileNames ) => {
              if ( err ) {
                reject( err );
              } else {
                let ids = fileNames
                    .filter(fileName => fileName !== INDEX_FILE + YAML_EXT && fileName.endsWith(YAML_EXT))
                    .map(fileName => fileName.replace(YAML_EXT, ""));
                resolve(ids);
              }
            } );
          } else {
            resolve( [] );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Delete document
   * @param {Environment} env
   * @param {string} title
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  public deleteDocument( env: Environment, title: string, id: string ): Promise<boolean> {
    return new Promise<boolean>( ( resolve, reject ) => {
      try {
        let filePath = this.getPath( env, title, id );
        logger.silly( "delete document: " + filePath );

        fs.exists( filePath, exists => {
          if ( exists ) {
            fs.unlink( filePath, ( err ) => {
              if ( err ) {
                reject( err );
              } else {
                resolve( true );
              }
            } );
          } else {
            resolve( false );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } ).then( ( deleted ) => {
      this.deleteDir( env, title ).then();
      return Promise.resolve( deleted );
    } );
  }

  /**
   * Store document index
   * @param {Environment} env
   * @param {ProjectMetadata} index
   * @returns {Promise<ProjectMetadata>}
   */
  public storeIndex( env: Environment, index: ProjectMetadata ): Promise<ProjectMetadata> {
    return new Promise( ( resolve, reject ) => {
      try {
        let filePath = this.getPath( env, index.title, INDEX_FILE );
        logger.silly( "store index: " + filePath );

        let yamlDocument = yaml.safeDump( index, {schema: DEFAULT_FULL_SCHEMA } );
        this.makeParentDir( filePath ).then( () => {
          fs.writeFile( filePath, yamlDocument, ( err ) => {
            if ( err ) {
              reject( err );
            } else {
              resolve( index );
            }
          } );
        } ).catch( reject );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Load document index
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<ProjectMetadata>}
   */
  public loadIndex( env: Environment, title: string ): Promise<ProjectMetadata> {
    return new Promise( ( resolve, reject ) => {
      try {
        let filePath = this.getPath( env, title, INDEX_FILE );
        logger.silly( "load index: " + filePath );

        fs.exists( filePath, ( exists ) => {
          if ( exists ) {
            fs.readFile( filePath, ( err, data ) => {
              if ( err ) {
                reject( err );
              } else {
                let index = yaml.safeLoad( data.toString(), {schema: DEFAULT_FULL_SCHEMA } ) as ProjectMetadata;
                resolve( index );
              }
            } );
          } else {
            resolve( null );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Load all document indexes
   * @param {Environment} env
   * @returns {Promise<ProjectMetadata[]>}
   */
  public loadIndexes( env: Environment ): Promise<ProjectMetadata[]> {
    return new Promise( ( resolve, reject ) => {
      try {
        let folder = this.resolvePath( env.name );
        fs.exists( folder, exists => {
          if ( exists ) {
            fs.readdir( folder, ( err, folderNames ) => {
              if ( err ) {
                reject( err );
              } else {
                let promisses = folderNames.map( title => {
                  return this.loadIndex( env, title );
                } );
                Promise.all( promisses ).then( indexes => {
                  resolve( indexes.filter( index => index ) );
                } ).catch( reject );
              }
            } );
          } else {
            resolve( [] );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Delete document index
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<ProjectInfo>}
   */
  public deleteIndex( env: Environment, title: string ): Promise<boolean> {
    return new Promise<boolean>( ( resolve, reject ) => {
      try {
        let filePath = this.getPath( env, title, INDEX_FILE );
        logger.silly( "delete index: " + filePath );

        fs.exists( filePath, ( exists ) => {
          if ( exists ) {
            fs.unlink( filePath, ( err ) => {
              if ( err ) {
                reject( err );
              } else {
                resolve( true );
              }
            } );
          } else {
            resolve( false );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } ).then( ( deleted ) => {
      this.deleteDir( env, title ).then();
      return Promise.resolve( deleted );
    } );
  }

  /**
   * Remove directory if empty
   * @param {Environment} env
   * @param {string} title
   * @returns {Promise<void>}
   */
  private deleteDir( env: Environment, title: string ): Promise<void> {
    return new Promise<void>( ( resolve, reject ) => {
      try {
        let folder = this.resolvePath( pathUtil.join( env.name, title ) );
        fs.rmdir( folder, ( err ) => {
          resolve();
        } );
      } catch ( e ) {
        logger.warn( "Error while deleting dir for '" + env + "/" + title + "'", e );
        resolve();
      }
    } );
  }

  /**
   * Get the absolute path for the tree
   * @param {Environment} env
   * @returns {string}
   */
  private getTreePath( env: Environment ): string {
    return this.resolvePath( pathUtil.join( env.name, TREE_FILE + YAML_EXT ) );
  }

  /**
   * Generate an id for a document
   * @param env
   * @param title
   * @return generated id
   */
  private generateId( env: Environment, title: string ): Promise<string> {
    return new Promise<string>( ( resolve, reject ) => {
      try {
        let id   = uuid();
        let path = this.getPath( env, title, id );
        fs.exists( path, exists => {
          if ( exists ) {
            // Try again
            this.generateId( env, title ).then( resolve ).catch( reject );
          } else {
            resolve( id );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Get the absolute path
   * @param {Environment} env
   * @param {string} title
   * @param {string} version
   * @returns {string}
   */
  private getPath( env: Environment, title: string, id: string ) {
    return this.resolvePath(
        pathUtil.join( env.name.toLowerCase(), title.toLowerCase(), id.toLowerCase() + YAML_EXT ) );
  }

  /**
   * Get absolute path of a file
   * @param {string} path
   * @returns {string}
   */
  private resolvePath( path: string ): string {
    return pathUtil.resolve( process.cwd(), this.dataFolder, path );
  }

  /**
   * Create parent folder of a path
   * @param {string} path
   * @returns {string}
   */
  private makeParentDir( path: string ): Promise<void> {
    return new Promise<void>( ( resolve, reject ) => {
      let dir = pathUtil.parse( path ).dir;
      mkdirp( dir, err => {
        if ( err ) {
          reject( err );
        } else {
          resolve();
        }
      } );
    } );
  }

}