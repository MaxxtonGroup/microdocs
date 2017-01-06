#!/usr/bin/env node
/// <reference path="../typings/index.d.ts" />

import * as pjson from '../package.json';
import * as program from 'commander';
import * as globby from 'globby';
import * as fs from 'fs';
import * as cliHelper from "./helpers/cli.helper";
import { MicroDocsCrawler } from './crawler/microdocs-crawler';
import { ServerOptions } from "./options/server.options";
import { CheckOptions } from "./options/check.options";
import { PublishOptions } from "./options/publish.options";
import { ClusterOptions } from "./options/cluster.options";
import { DockerClusterService } from "./docker/docker-cluster.service";

function list( val: string ) {
  return val.split( ',' );
}

program
    .version( pjson.version );

program
    .command( 'build' )
    .description( "Build the microdocs definitions" )
    // default options
    .option( '-s, --sourceFiles [files]', 'Add source file', list )
    .option( '-d, --sourceFolders [folders]', 'Add source folders', list )
    .option( '-t, --filePattern <pattern>', 'pattern to match source files', '/**/*.ts' )
    .option( '-c, --tsConfig <file>', 'Set the location of the tsconfig.json', 'tsconfig.json' )
    // addition options
    .option( '-o, --outputFile <file>', 'Set the output file', 'microdocs.json' )
    .action( ( env: any ) => {
      var src        = getFiles();
      var tsConfig   = getTsConfig();
      var outputFile = getOutputFile( env );

      // check input
      if ( !src || src.length == 0 ) {
        console.warn( "Missing input files, use '--sourceFiles [files] or --sourceFolders [folders]'" );
        return;
      }
      if ( !tsConfig ) {
        console.warn( "Missing tsConfig file, use '--tsConfig <file>' to specify the tsconfig.json file" );
        return;
      }
      if ( !outputFile ) {
        console.warn( "Missing outputFile, use '--outputFile <file>', to specify the output file" );
        return;
      }

      // build definitions
      var crawler = new MicroDocsCrawler();
      crawler.build( src, outputFile, tsConfig );
    } );

program
    .command( 'check' )
    .description( "Check for breaking changes" )
    // default options
    .option( '-s, --sourceFiles [files]', 'Add source file', list )
    .option( '-d, --sourceFolders [folders]', 'Add source folders', list )
    .option( '-t, --filePattern <pattern>', 'pattern to match source files', '/**/*.ts' )
    .option( '-c, --tsConfig <file>', 'Set the location of the tsconfig.json', 'tsconfig.json' )
    // addition options
    .option( '-n, --title <projectTitle>', 'Title of the project' )
    .option( '-e, --env <env>', "Environment to publish on" )
    .option( '-s, --server <url>', 'Url of the MicroDocs server', 'http://localhost:3000' )
    .option( '-u, --username <user>', 'Username to access the MicroDocs server' )
    .option( '-p, --password <password>', 'Password to access the MicroDocs server' )
    .action( ( env: any ) => {
      var src          = getFiles();
      var tsConfig     = getTsConfig();
      var checkOptinos = getCheckOptions( env );

      // check input
      if ( !src || src.length == 0 ) {
        console.warn( "Missing input files, use '--sourceFiles [files] or -sourceFolders [folders]'" );
        return;
      }
      if ( !tsConfig ) {
        console.warn( "Missing tsConfig file, use '--tsConfig <file>' to specify the tsconfig.json file" );
        return;
      }


      // build definitions
      var crawler = new MicroDocsCrawler();
      crawler.check( src, checkOptinos, tsConfig, result => {
        cliHelper.printProblemResponse( result, getFolders() );
      } );
    } );

program
    .command( 'publish' )
    .description( "Check for breaking changes" )
    // default options
    .option( '-s, --sourceFiles [files]', 'Add source file', list )
    .option( '-d, --sourceFolders [folders]', 'Add source folders', list )
    .option( '-t, --filePattern <pattern>', 'pattern to match source files', '/**/*.ts' )
    .option( '-c, --tsConfig <file>', 'Set the location of the tsconfig.json', 'tsconfig.json' )
    // addition options
    .option( '-n, --title <projectTitle>', 'Title of the project' )
    .option( '-f, --force', "Don't stop publishing when there are problems" )
    .option( '-e, --env <env>', "Environment to publish on" )
    .option( '-v, --pversion <projectVersion>', 'Version of the project' )
    .option( '-g, --group <projectGroup>', 'Group of the project' )
    .option( '-s, --server <url>', 'Url of the MicroDocs server', 'http://localhost:3000' )
    .option( '-u, --username <user>', 'Username to access the MicroDocs server' )
    .option( '-p, --password <password>', 'Password to access the MicroDocs server' )
    .action( ( env: any ) => {
      var src            = getFiles();
      var tsConfig       = getTsConfig();
      var publishOptions = getPublishOptions( env );

      // check input
      if ( !src || src.length == 0 ) {
        console.warn( "Missing input files, use '--sourceFiles [files] or -sourceFolders [folders]'" );
        return;
      }
      if ( !tsConfig ) {
        console.warn( "Missing tsConfig file, use '--tsConfig <file>' to specify the tsconfig.json file" );
        return;
      }
      if ( !publishOptions.title || publishOptions.title.trim() === '' ) {
        console.warn( "Missing project title, use '--title <projecttitle>' to specify title of the project" );
        return;
      }

      // build definitions
      var crawler = new MicroDocsCrawler();
      crawler.publish( src, publishOptions, tsConfig, result => {
        cliHelper.printProblemResponse( result, getFolders() );
      } );
    } );

program
    .command( 'up' )
    .usage( "[options] <project|all>" )
    .description( "Start local docker cluster" )
    .option( '-c, --cluster <name>', 'Set the name of the cluster', 'default' )
    .option( '-e, --env <env>', 'Set the environment of MicroDocs to pull from' )
    .option( '-g, --group <groups>', 'Filter on groups, use ! in front of the group name to exclude' )
    .option( '-q, --project <projects>', 'Filter on projects, use ! in front of the project name to exclude' )
    .option( '-b, --build [dockerfile]', 'Build this project first' )
    .option( '-d, --buildContext <dir>', 'Build directory' )
    .option( '-a, --buildArgs <args>', 'Build arguments', list )
    .option( '-de, --denv <denv>', 'Set docker environment variables', list )
    .option( '-dp, --dpublish <dpublish>', 'Publish docker ports to the host', list )
    .option( '-dv, --dvolume <dvolume>', 'Bind mount a docker volume', list )
    .option( '-s, --server <url>', 'Url of the MicroDocs server', 'http://localhost:3000' )
    .option( '-u, --username <user>', 'Username to access the MicroDocs server' )
    .option( '-p, --password <password>', 'Password to access the MicroDocs server' )
    .action( function ( env: any ) {
      if ( env[ 1 ] ) {
        let clusterOptions = getClusterOptions( this );
        if ( env !== 'all' ) {
          clusterOptions.targetProject = env.indexOf( ':' )[ 0 ];
          clusterOptions.targetVersion = env.indexOf( ':' )[ 1 ];
        }

        let dockerClusterService = new DockerClusterService();
        dockerClusterService.up( clusterOptions );

        return false;
      }
      this.help();
      return true;
    } );

program
    .command( "down" )
    .usage( "[options] <project|all>" )
    .option( '-c, --cluster <name>', 'Set the name of the cluster', 'default' )
    .option( '-v, --volumes', 'Remove docker volumes', list )
    .action( function ( env: any ) {
      if ( env[ 1 ] ) {
        let clusterOptions = getClusterOptions( this );
        if ( env !== 'all' ) {
          clusterOptions.targetProject = env.indexOf( ':' )[ 0 ];
          clusterOptions.targetVersion = env.indexOf( ':' )[ 1 ];
        }

        let dockerClusterService = new DockerClusterService();
        dockerClusterService.down( clusterOptions );

        return false;
      }
      this.help();
      return true;
    } );



program
    .command( '' )
    .action( function ( env ) {
      program.help();
    } );

program.parse( process.argv );

if ( program.args.length == 0 ) {
  program.help();
}

function getFiles(): string[] {
  var folders: string[] = [];
  var files: string[]   = [];

  if ( program.args[0][ 'sourceFiles' ] ) {
    files = files.concat( program.args[0][ 'sourceFiles' ] );
  }

  if ( program.args[0][ 'sourceFolders' ] ) {
    folders = folders.concat( program.args[0][ 'sourceFolders' ] );
  }

  if ( folders.length == 0 && files.length == 0 ) {
    folders.push( process.cwd() );
  }

  folders.forEach(folder => {
    var matchFiles = files.concat(globby['sync']([folder + program.args[0]['filePattern']]));
    console.info(matchFiles);
    if(matchFiles){
      matchFiles.forEach(f => {
        files.push(f);
      });
    }
  });
  return files;
}

function getFolders(): string[] {
  var folders: string[] = [];

  if ( program.args[0][ 'sourceFolders' ] ) {
    folders = folders.concat( program.args[0][ 'sourceFolders' ] );
  }
  folders.push( process.cwd() );
  return folders;
}

function getTsConfig(): {} {
  var file              = program.args[0][ 'tsConfig' ];
  var folders: string[] = getFolders();

  for ( var i = 0; i < folders.length; i++ ) {
    var tsFile = folders[ i ] + '/' + file;
    if ( fs.existsSync( tsFile ) ) {
      try {
        var tsConfig: any = fs.readFileSync( tsFile ).toString();
        var json          = JSON.parse( tsConfig );
        if ( json.compilerOptions ) {
          console.info( "Use " + tsFile );
          json.compilerOptions[ 'ignoreCompilerErrors' ] = true;
          return json.compilerOptions;
        }
      } catch ( e ) {
        console.error( e );
      }
    }
  }
  return null;
}

function getOutputFile( options: any ): string {
  return options.outputFile ? options.outputFile : null;
}

function getPublishOptions( options: any ): CheckOptions {
  var publishOptions: PublishOptions = getCheckOptions( options );
  if ( options.group ) {
    publishOptions.group = options.group;
  }
  if ( options.pversion ) {
    publishOptions.version = options.pversion;
  }
  if ( options.force ) {
    publishOptions.force = true;
  }
  return publishOptions;
}

function getCheckOptions( options: any ): CheckOptions {
  var checkOptions: CheckOptions = getServerOptions( options );
  if ( options.title ) {
    checkOptions.title = options.title;
  }
  if ( options.env ) {
    checkOptions.env = options.env;
  }
  return checkOptions;
}

function getServerOptions( options: any ): ServerOptions {
  var serverOptions: ServerOptions = {
    url: options.server
  };
  if ( options.username ) {
    serverOptions.username = options.username;
  }
  if ( options.password ) {
    serverOptions.password = options.password;
  }
  return serverOptions;
}



function getClusterOptions( options: any ): ClusterOptions {
  var clusterOptions: ClusterOptions = {
    url: options.server
  };
  if ( options.username ) {
    clusterOptions.username = options.username;
  }
  if ( options.password ) {
    clusterOptions.password = options.password;
  }
  if ( options.cluster ) {
    clusterOptions.clusterName = options.cluster;
  }
  if ( options.env ) {
    clusterOptions.env = options.env;
  }
  if ( options.group ) {
    clusterOptions.filterGroups = options.group;
  }
  if ( options.project ) {
    clusterOptions.filterProjects = options.project;
  }
  if ( options.denv ) {
    clusterOptions.denv = options.denv;
  }
  if ( options.dpublish ) {
    clusterOptions.dpublish = options.dpublish;
  }
  if ( options.dvolume ) {
    clusterOptions.dvolume = options.dvolume;
  }
  if ( options.build ) {
    clusterOptions.build = true;
    if ( typeof(options.build) === 'string' ) {
      clusterOptions.dockerfile = options.build;
    }
  }
  if ( options.buildContext ) {
    clusterOptions.buildContext = options.buildContext;
  }
  if ( options.buildArgs ) {
    clusterOptions.buildArgs = {};
    options.buildArgs.forEach( ( arg: string ) => {
      let pair                              = arg.split( '=' );
      clusterOptions.buildArgs[ pair[ 0 ] ] = pair[ 1 ];
    } );
  }
  return clusterOptions;
}