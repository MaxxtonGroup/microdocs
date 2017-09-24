import * as fs from "fs"
import * as pathUtil from "path";
import { Inject, Service, Token } from "typedi";
import { App } from "@webscale/boot";
import { LoggerFactory } from "@webscale/logging"
import * as mkdirp from "mkdirp";
import * as yaml from "js-yaml";
import { DEFAULT_FULL_SCHEMA } from "js-yaml";

import { storage } from "../../property-keys";
import { ScriptRepository } from "../script.repo";
import { Environment } from "@maxxton/microdocs-core/domain";
import { Script } from "@maxxton/microdocs-core/pre-processor/script.model";

const logger   = LoggerFactory.create();
const YAML_EXT = ".yml";

export class ScriptYamlRepository extends ScriptRepository {

  constructor(private scriptFolder: string) {
    super();
  }

  /**
   * Load script names for an environment
   * @param env
   * @returns Promise<string[]>
   */
  public loadScriptNames( env: Environment ): Promise<string[]> {
    return new Promise( ( resolve, reject ) => {
      try {
        let folder = pathUtil.join( this.scriptFolder, env.name.toLowerCase() );
        fs.exists( folder, exists => {
          if ( exists ) {
            fs.readdir( folder, ( err, fileNames ) => {
              if ( err ) {
                reject( err );
              } else {
                let scriptNames = fileNames
                    .filter( fileName => fileName.endsWith( YAML_EXT ) )
                    .map( fileName => fileName.replace( YAML_EXT, "" ).toLowerCase() );
                resolve( scriptNames );
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
   * Load script
   * @param env
   * @param name
   * @returns Promise<Script>
   */
  public loadScript( env: Environment, name: string ): Promise<Script> {
    return new Promise( ( resolve, reject ) => {
      try {
        let filePath = pathUtil.join( this.scriptFolder, env.name.toLowerCase(), name.toLowerCase() + YAML_EXT );
        logger.silly( "load script: " + filePath );

        fs.exists( filePath, exists => {
          if ( exists ) {
            fs.readFile( filePath, ( err, data ) => {
              if ( err ) {
                reject( err );
              } else {
                let script = yaml.safeLoad( data.toString(), { schema: DEFAULT_FULL_SCHEMA } ) as Script;
                resolve( script );
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
   * Store script
   * @param env
   * @param script
   * @returns Promise<Script>
   */
  public storeScript( env: Environment, script: Script ): Promise<Script> {
    return new Promise( ( resolve, reject ) => {
      try {
        let filePath = pathUtil.join( this.scriptFolder, env.name.toLowerCase(), script.name.toLowerCase() + YAML_EXT );
        logger.silly( "store script: " + filePath );

        let yamlDocument = yaml.safeDump( script, { schema: DEFAULT_FULL_SCHEMA } );
        this.makeParentDir( filePath ).then( () => {
          fs.writeFile( filePath, yamlDocument, ( err ) => {
            if ( err ) {
              reject( err );
            } else {
              resolve( script );
            }
          } );
        } ).catch( reject );
      } catch ( e ) {
        reject( e );
      }
    } );
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