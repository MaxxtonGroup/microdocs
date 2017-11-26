import * as fs from "fs"
import * as pathUtil from "path";
import { Inject, Service, Token } from "typedi";
import { App } from "@webscale/boot";
import { LoggerFactory } from "@webscale/logging"
import * as mkdirp from "mkdirp";
import * as yaml from "js-yaml";
import { DEFAULT_FULL_SCHEMA } from "js-yaml";

import { storage } from "../../property-keys";
import { TemplateRepository } from "../template.repo";
import { Template } from "@maxxton/microdocs-core/template";
import { Environment } from "@maxxton/microdocs-core/domain";

const logger   = LoggerFactory.create();
const YAML_EXT = ".yml";

@Service()
export class TemplateYamlRepository extends TemplateRepository {

  templatesFolder: string;

  constructor(private app: App) {
    super();
    this.templatesFolder = pathUtil.resolve( process.cwd(),
        this.app.properties.getString( storage.yaml.templatesFolder, 'data/config/templates' ) );
  }

  /**
   * Load template names for an environment
   * @param env
   * @param projectName
   * @returns Promise<string[]>
   */
  public loadTemplateNames( env: Environment, projectName:string ): Promise<string[]> {
    return new Promise( ( resolve, reject ) => {
      try {
        let folder = pathUtil.join( this.templatesFolder, env.name.toLowerCase(), projectName.toLowerCase() );
        fs.exists( folder, exists => {
          if ( exists ) {
            fs.readdir( folder, ( err, fileNames ) => {
              if ( err ) {
                reject( err );
              } else {
                let templateNames = fileNames
                    .filter( fileName => fileName.endsWith( YAML_EXT ) )
                    .map( fileName => fileName.replace( YAML_EXT, "" ).toLowerCase() );
                resolve( templateNames );
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
   * Load template
   * @param env
   * @param projectName
   * @param name
   * @returns Promise<Template>
   */
  public loadTemplate( env: Environment, projectName:string, name: string ): Promise<Template> {
    return new Promise( ( resolve, reject ) => {
      try {
        let filePath = pathUtil.join( this.templatesFolder, env.name.toLowerCase(), projectName.toLowerCase(), name.toLowerCase() + YAML_EXT );
        logger.silly( "load template: " + filePath );

        fs.exists( filePath, exists => {
          if ( exists ) {
            fs.readFile( filePath, ( err, data ) => {
              if ( err ) {
                reject( err );
              } else {
                let template = yaml.safeLoad( data.toString(), { schema: DEFAULT_FULL_SCHEMA } ) as Template;
                resolve( template );
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
   * Store template
   * @param env
   * @param projectName
   * @param template
   * @returns Promise<Template>
   */
  public storeTemplate( env: Environment, projectName:string, template: Template ): Promise<Template> {
    return new Promise( ( resolve, reject ) => {
      try {
        let filePath = pathUtil.join( this.templatesFolder, env.name.toLowerCase(), projectName.toLowerCase(), template.name.toLowerCase() + YAML_EXT );
        logger.silly( "store template: " + filePath );

        let yamlDocument = yaml.safeDump( template, { schema: DEFAULT_FULL_SCHEMA } );
        this.makeParentDir( filePath ).then( () => {
          fs.writeFile( filePath, yamlDocument, ( err ) => {
            if ( err ) {
              reject( err );
            } else {
              resolve( template );
            }
          } );
        } ).catch( reject );
      } catch ( e ) {
        reject( e );
      }
    } );
  }



  /**
   * Delete template
   * @param env
   * @param projectName
   * @param name
   * @returns Promise<boolean>
   */
  public async deleteTemplate( env: Environment, projectName:string, name: string ): Promise<boolean>{
    return new Promise<boolean>( ( resolve, reject ) => {
      try {
        let filePath = pathUtil.join( this.templatesFolder, env.name.toLowerCase(), projectName.toLowerCase(), name.toLowerCase() + YAML_EXT );
        logger.silly( "delete template: " + filePath );

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