import { ClusterOptions } from "../options/cluster.options";
import { MicroDocsClient } from "../clients/microdocs-client";
import { ProblemResponse } from "@maxxton/microdocs-core/domain";
import * as cliHelper from "../helpers/cli.helper";
import * as fs from 'fs';
import * as path from 'path';
import { DockerCompose } from "./domain/docker-compose";
import { dockerComposeUp, dockerComposePs, dockerComposeDown } from "./docker-executor";
import { Build } from "./domain/build";
import { JSLogger } from "../helpers/logging/js-logger";
const yaml = require('js-yaml');
const osenv = require('osenv');


/**
 * Utillity to start a local docker cluster
 * @author Steven Hermans
 */
export class DockerClusterService {

  /**
   * Start a local cluster
   * @param filter
   */
  public up( options: ClusterOptions ) {
    this.fetchDockerCompose( options );
  }

  /**
   * Stop a local cluster
   * @param filter
   */
  public down( options: ClusterOptions ) {
    let composeName: string = this.getComposeName( options );
    let clusterDir: string  = this.getClusterDir( options.clusterName );
    if ( composeName !== 'all' ) {
      console.info( 'update docker-compose' );
      let composeFile: string = path.join(clusterDir, composeName + '.yml');

      this.removeCluster(options.clusterName, [composeFile]);
      fs.unlinkSync( composeFile );

      this.updateCluster(clusterDir);
    }else{
      this.removeCluster(options.clusterName, this.getFiles(clusterDir).map(file => path.join(clusterDir, file)));
    }
  }

  private removeCluster(clusterName:string = 'default', composeFiles:string[]){
    console.info( 'down docker-compose' );
    let clusterDir: string  = this.getClusterDir( clusterName );
    let childProcess = dockerComposeDown({cwd: clusterDir, cleanOrphans: true, removeVolume: true, composeFiles: composeFiles}, ( error: Error, stdout: string, stderr: string ) => {
      console.log( stdout );
      console.error( stderr );
      if ( !error ) {
        this.getFiles(clusterDir).forEach(file => fs.unlinkSync(path.join(clusterDir, file)));
        this.listCluster(clusterDir);
      }else{
        console.error( error.message );
        process.exit(1);
      }
    } );
    childProcess.stdout.on( 'data', function ( data: any ) {
      console.log( data.toString() );
    } );
  }

  private listCluster(clusterDir:string){
    let childProcess = dockerComposePs({cwd: clusterDir}, ( error: Error, stdout: string, stderr: string ) => {
      console.log( stdout );
      console.error( stderr );
      if ( error ) {
        console.error( error.message );
      }
    } );
    childProcess.stdout.on( 'data', function ( data: any ) {
      console.log( data.toString() );
    } );
  }

  private updateCluster(clusterDir:string){
    console.info( 'docker-compose up' );
    let composeFiles:string[] = this.getFiles(clusterDir).map(file => path.join(clusterDir, file));
    let childProcess = dockerComposeUp( {
      forceBuild: true,
      detached: true,
      cleanOrphans: true,
      cwd: clusterDir,
      composeFiles: composeFiles
    }, ( error: Error, stdout: string, stderr: string ) => {
      console.log( stdout );
      console.error( stderr );
      if ( !error ) {
        dockerComposePs({cwd: clusterDir});
      }else{
        console.error( error.message );
        process.exit(1);
      }
    } );
    childProcess.stdout.on( 'data', function ( data: any ) {
      console.log( data.toString() );
    } );
  }

  private fetchDockerCompose( options: ClusterOptions ) {
    console.info( 'Fetch docker-compose' );
    let microDocsClient = new MicroDocsClient(new JSLogger());
    microDocsClient.getProjects( options, 'docker-compose', ( response: ProblemResponse|string ) => {
      if ( typeof(response) === 'string' ) {
        let dockerCompose: DockerCompose = <DockerCompose>(<any>yaml).load( response );
        this.addDockerOptions( options, dockerCompose );

        console.info( 'store docker-compose' );
        let clusterDir = this.getClusterDir( options.clusterName );
        this.storeDockerCompose( clusterDir, options, dockerCompose );

        this.updateCluster(clusterDir);
      } else {
        cliHelper.printProblemResponse( response );
      }
    } );
  }

  private addDockerOptions( options: ClusterOptions, compose: DockerCompose ) {
    if ( options.targetProject ) {
      if ( compose.services ) {
        Object.keys( compose.services )
            .filter( name => name.toLowerCase().indexOf( options.targetProject ) == 0 )
            .forEach( name => {
              let service = compose.services[ name ];
              if ( options.dpublish ) {
                if ( !service.ports ) {
                  service.ports = [];
                }
                options.dpublish.forEach( port => service.ports.push( port ) );
              }
              if ( options.denv ) {
                if ( !service.environment ) {
                  service.environment = [];
                }
                options.denv.forEach( env => service.environment.push( env ) );
              }
              if ( options.dvolume ) {
                if ( !service.volumes ) {
                  service.volumes = [];
                }
                options.dvolume.forEach( volume => service.volumes.push( volume ) );
              }

              if ( options.build ) {
                let build: Build = {};
                if ( service.build ) {
                  if ( typeof(service.build) === 'string' ) {
                    build.context = <string>service.build;
                  } else if ( typeof(service.build) === 'object' ) {
                    build = service.build;
                  }
                }
                if ( options.dockerfile ) {
                  build.dockerfile = options.dockerfile;
                }
                if ( options.buildContext ) {
                  build.context = options.buildContext;
                }
                if ( options.buildArgs ) {
                  if ( !build.args ) {
                    build.args = {};
                  }
                  Object.keys( options.buildArgs ).forEach( arg => build.args[ arg ] = options.buildArgs[ arg ] );
                }
                if(build.context){
                  build.context = path.join(process.cwd(), build.context);
                }else{
                  build.context = process.cwd();
                }
                service.build = build;

              }
            } );
      }
    }
  }

  private storeDockerCompose( clusterDir: string, options: ClusterOptions, dockerCompose: DockerCompose ) {
    // save compose file
    let composeName    = this.getComposeName( options );
    let composeContent = (<any>yaml).dump( dockerCompose );
    fs.writeFileSync( path.join( clusterDir, composeName + '.yml' ), composeContent );
  }

  private getClusterDir( cluster: string = 'default' ): string {
    let microdocsHome = osenv.home() + '/.microdocs';
    if ( !fs.existsSync( microdocsHome ) ) {
      fs.mkdirSync( microdocsHome );
    }
    let v1 = microdocsHome + '/v1';
    if ( !fs.existsSync( v1 ) ) {
      fs.mkdirSync( v1 );
    }
    let clusterDir = v1 + '/' + cluster;
    if ( !fs.existsSync( clusterDir ) ) {
      fs.mkdirSync( clusterDir );
    }
    return clusterDir;
  }

  private getComposeName( options: ClusterOptions ): string {
    if(!options.targetProject){
      return 'all';
    }else{
      return options.targetProject + (options.targetVersion ? ':' + options.targetVersion : '');
    }
  }

  private getFiles( dir: string ): string[] {
    if ( fs.existsSync( dir ) ) {
      return fs.readdirSync( dir ).map( ( file: string ) => {
        return { file: file, stats: fs.statSync( path.join( dir, file ) ) };
      } ).filter( item => item.stats.isFile() ).sort( ( item1: any, item2: any ) => item1.stats.mtime - item2.stats.mtime ).map( item => item.file );
    }
    return [];
  }

}