import { Project, ProblemResponse, ProblemLevels } from '@maxxton/microdocs-core/domain';
import { ProjectBuilder } from '@maxxton/microdocs-core/builder/index';
import { Application } from "@maxxton/typedoc";
import * as fs from 'fs';
import * as pathUtil from 'path';

import { RootCrawler } from "./common/root.crawler";
import { CrawlerException } from "./common/crawler.exception";
import { Framework, FRAMEWORKS } from "./frameworks";
import { CheckOptions } from "../options/check.options";
import { MicroDocsClient } from "../clients/microdocs-client";
import * as cliHelper from '../helpers/cli.helper';
import { PublishOptions } from "../options/publish.options";
import { Logger } from '../helpers/logging/logger';
import { ServerOptions } from "../options/server.options";
import { BitBucketClient } from "../clients/bitbucket-client";
const mkdirp = require('mkdirp');
const hasher = require( 'glob-hash' );
const globby = require( 'globby' );
const Preferences = require("preferences");

/**
 * Base crawler to crawl Typescript sources
 */
export class MicroDocsCrawler {

  private readonly logger: Logger;

  constructor( logger: Logger ) {
    this.logger = logger;
  }

  /**
   * Build the MicroDocs definitions from source
   * @param options
   * @param callback
   * @return {Project}
   */
  public build( options: { source?: string, filePatterns?: string[], tsConfig?: string, definitionFile?: string, noCache?: boolean, noBuild?: boolean } ): Promise<Project> {
    return new Promise<Project>( ( resolve: ( project: Project ) => void, reject: ( err: any ) => void ) => {
      try {
        let source         = pathUtil.resolve( (options && options.source) || process.cwd() );
        let filePatterns   = (options && options.filePatterns) || [ '/**/*.ts', '!/**/*.spec.ts' ];
        let tsConfigFile   = (options && options.tsConfig) || 'tsconfig.json';
        let definitionFile = (options && options.definitionFile) || 'microdocs.json';
        let noCache        = (options && options.noCache) || false;
        let noBuild        = (options && options.noBuild) || false;

        if ( noCache && noBuild ) {
          let error = new Error( "'no build' and 'no cache' cannot be used at the same time" );
          reject( error );
          return;
        }

        let sourceFiles: string[] = this.getSourceFiles( source, filePatterns );
        if ( sourceFiles.length == 0 ) {
          let error: Error = new CrawlerException( `No sources found in '${source}' which matches '${filePatterns}'` );
          reject( error );
          return;
        }

        let hashFile: string = definitionFile + '.hash';
        if ( definitionFile && fs.existsSync( definitionFile ) && !noCache ) {
          if ( noBuild ) {
            try {
              let project: Project = <Project>require( definitionFile );
              this.logger.info( "Skip building the MicroDocs definitions, use the '--no-cache' option to enforce this" );
              resolve( project );
              return;
            } catch ( e ) {
              let error = new Error( `Definition file could not be loaded from '$(outputFile}'` );
              reject( error );
            }
          } else if ( hashFile && fs.existsSync( hashFile ) ) {
            let hash = fs.readFileSync( hashFile );
            hasher( { include: sourceFiles, filenames: true } ).then( ( newHash: any ) => {
              if ( newHash === hash.toString() ) {
                try {
                  let project: Project = <Project>require( definitionFile );
                  this.logger.info( "Skip building the MicroDocs definitions, use the '--no-cache' option to enforce this" );
                  resolve( project );
                  return;
                } catch ( e ) {
                  this.logger.warn( `Failed to load cached definitions from '${definitionFile}', rebuilding definitions...` );
                }
              }
              this.buildDefinition( source, sourceFiles, tsConfigFile, definitionFile, newHash.hash )
                  .then( ( project: Project ) => resolve( project ), ( error: any ) => reject( error ) );
            }, ( err: any ) => {
              reject( err );
            } );
            return;
          }
        }

        this.buildDefinition( source, sourceFiles, tsConfigFile, definitionFile )
            .then( ( project: Project ) => resolve( project ), ( error: any ) => reject( error ) );
      } catch ( e ) {
        reject( e );
      }

    } );
  }

  /**
   * Build definitions and save it to a file with a hash of the sources
   * @param source
   * @param filePatterns
   * @param tsConfigFile
   * @param definitionFile
   * @param hash
   * @return {Promise<Project>}
   */
  private buildDefinition( source: string, sourceFiles: string[], tsConfigFile: string, definitionFile: string, hash?: string ): Promise<Project> {
    return new Promise<Project>( ( resolve: ( project: Project ) => void, reject: ( err: any ) => void ) => {
      try {


        let tsConfig: any = this.getTsConfig( tsConfigFile, [ source, process.cwd() ] );
        if ( !tsConfig ) {
          this.logger.warn( `No tsConfig found in '${tsConfigFile}', use default compile options` );
          tsConfig = {};
        }
        if ( tsConfig.ignoreCompilerErrors !== false ) {
          tsConfig.ignoreCompilerErrors = true;
        }

        let project: Project = this.buildProject( sourceFiles, tsConfig );

        if ( definitionFile ) {
          this.logger.info( `Store definitions in '${definitionFile}'` );
          let hashFile         = definitionFile + '.hash';
          let json             = JSON.stringify( project );
          let definitionFolder = pathUtil.dirname( definitionFile );
          mkdirp.sync( definitionFolder );
          if ( hash ) {
            fs.writeFileSync( hashFile, hash );
            try {
              fs.writeFileSync( definitionFile, json );
            } catch ( e ) {
              try {
                fs.unlink( hashFile );
              } catch ( ee ) {
              }
              throw e;
            }
          } else {
            hasher( { include: sourceFiles, filenames: true } ).then( ( newHash: any ) => {
              try {
                fs.writeFileSync( hashFile, newHash );
                try {
                  fs.writeFileSync( definitionFile, json );
                } catch ( e ) {
                  try {
                    fs.unlink( hashFile );
                  } catch ( ee ) {
                  }
                  throw e;
                }
              } catch ( err ) {
                reject( err );
              }
            }, ( err: any ) => {
              reject( err );
            } );
          }
        }

        resolve( project );
      } catch ( e ) {
        reject( e );
      }
    } );
  }


  /**
   * Build the MicroDocs definitions from source
   * @param sources entry points to start crawling
   * @param tsConfig typescript compiler options
   * @param frameworks specify which frameworks should be build
   * @returns {Project} MicroDocs definition
   */
  private buildProject( sources: string[], tsConfig: {} = {}, frameworks: Framework[] = FRAMEWORKS ): Project {
    // Check frameworks
    if ( frameworks.length == 0 ) {
      throw new CrawlerException( 'No framework selected' );
    }

    // Convert source to reflection
    this.logger.info( 'Crawl sources with config:' );
    this.logger.info( JSON.stringify( tsConfig, undefined, 2 ) );
    var typedocApplication = new Application( tsConfig );
    var reflect            = typedocApplication.convert( sources );

    if ( !reflect ) {
      throw new Error( "Compiling failed" );
    }

    // Init Crawling
    var rootCrawler = new RootCrawler();
    frameworks.forEach( framework => {
      framework.initCrawlers().forEach( crawler => rootCrawler.registerCrawler( crawler ) );
    } );

    // Start Crawling
    var projectBuilder = new ProjectBuilder();
    rootCrawler.crawl( projectBuilder, reflect );

    return projectBuilder.build();
  }

  /**
   * Login to the MicroDocs server and store/load credentials to a config file
   * @param options
   * @return {Promise<ServerOptions>}
   */
  public login( options: { url?: string, username?: string, password?: string, noCredentialStore?: boolean, noChecking?: boolean } ): Promise<ServerOptions> {
    return new Promise( ( resolve: (result:ServerOptions) => void, reject: ( err?: any ) => void ) => {
      try {
        const prefs                      = new Preferences( 'microdocs', {
          server: {
            url: 'http://localhost',
            username: '',
            password: ''
          }
        } );
        let url                          = options.url || prefs.server.url;
        let username                     = options.username || prefs.server.username;
        let password                     = options.password || prefs.server.password;
        let serverOptions: ServerOptions = {
          url: url,
          username: username,
          password: password
        };
        let noChecking                   = options.noChecking || false;
        let noCredentialStore            = options.noCredentialStore;
        if ( noChecking ) {
          if ( noCredentialStore ) {
            resolve( serverOptions );
          } else {
            prefs.server = serverOptions;
            prefs.save();
            resolve( serverOptions );
          }
        } else {
          new MicroDocsClient(this.logger).login( serverOptions ).then( () => {
            if ( noCredentialStore ) {
              resolve( serverOptions );
            } else {
              prefs.server = serverOptions;
              prefs.save();
              resolve( serverOptions );
            }
          }, reject );
        }
      }catch(e){
        reject(e);
      }
    } );
  }

  public check(project:Project, checkOptions:CheckOptions):Promise<ProblemResponse>{
    return new Promise( ( resolve: ( result: ProblemResponse ) => void, reject: ( err?: any ) => void ) => {
      let microDocsClient = new MicroDocsClient(this.logger);
      microDocsClient.check( checkOptions, project ).then((problemResponse:ProblemResponse) => {
        if(checkOptions.bitBucketPullRequestUrl){
          this.publishToBitBucket(checkOptions, problemResponse).then(resolve, reject);
        }else{
          resolve(problemResponse);
        }
      }, reject);
    });
  }

  public publish(project:Project, publishOptions:PublishOptions):Promise<ProblemResponse>{
    return new Promise( ( resolve: ( result: ProblemResponse ) => void, reject: ( err?: any ) => void ) => {
      let microDocsClient = new MicroDocsClient(this.logger);
      microDocsClient.publish( publishOptions, project ).then((problemResponse:ProblemResponse) => {
        if(publishOptions.bitBucketPullRequestUrl){
          this.publishToBitBucket(publishOptions, problemResponse).then(resolve, reject);
        }else{
          resolve(problemResponse);
        }
      }, reject);
    });
  }

  private publishToBitBucket(checkOptions:CheckOptions, problemResponse:ProblemResponse):Promise<ProblemResponse>{
    return new BitBucketClient(this.logger).publishToBitBucket(checkOptions, problemResponse);
  }

  private getSourceFiles( sourceFolder: string, filePatterns: string[] ): string[] {
    return globby[ 'sync' ]( filePatterns.map( pattern => {
      if ( pattern.indexOf( '!' ) === 0 ) {
        return '!' + pathUtil.join( sourceFolder, pattern.substring( 1 ) );
      } else {
        return pathUtil.join( sourceFolder, pattern );
      }
    } ) );
  }

  private getTsConfig( tsConfigFile: string, folders: string[] ): any {
    if ( fs.existsSync( tsConfigFile ) ) {
      try {
        this.logger.info( `Load tsConfig from '${tsConfigFile}'` );
        var tsConfig = require( tsConfigFile );
        if ( tsConfig.compilerOptions ) {
          if ( tsConfig.compilerOptions.ignoreCompilerErrors !== false ) {
            tsConfig.compilerOptions.ignoreCompilerErrors = true;
          }
          return tsConfig.compilerOptions;
        }
      } catch ( e ) {
        console.error( e );
      }
    }
    for ( let i = 0; i < folders.length; i++ ) {
      let tsFile = pathUtil.join( folders[ i ] + '/' + tsConfigFile );
      if ( fs.existsSync( tsFile ) ) {
        try {
          this.logger.info( `Load tsConfig from '${tsFile}'` );
          var tsConfig = require( tsFile );
          if ( tsConfig.compilerOptions ) {
            if ( tsConfig.compilerOptions.ignoreCompilerErrors !== false ) {
              tsConfig.compilerOptions.ignoreCompilerErrors = true;
            }
            return tsConfig.compilerOptions;
          }
        } catch ( e ) {
          console.error( e );
        }
      }
    }
    return null;
  }

}


