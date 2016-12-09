#!/usr/bin/env node
/// <reference path="../typings/index.d.ts" />

import * as pjson from '../package.json';
import * as program from 'commander';
import * as globby from 'globby';
import * as fs from 'fs';
import { MicroDocsCrawler } from './crawler/microdocs-crawler';
import { ServerOptions } from "./options/server.options";
import { CheckOptions } from "./options/check.options";
import { PublishOptions } from "./options/publish.options";

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
        console.warn( "Missing input files, use '--sourceFiles [files] or -sourceFolders [folders]'" );
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
        crawler.printProblemResponse( result, getFolders() );
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
        crawler.printProblemResponse( result, getFolders() );
      } );
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

  if ( program[ 'sourceFiles' ] ) {
    files = files.concat( program[ 'sourceFiles' ] );
  }

  if ( program[ 'sourceFolders' ] ) {
    folders = folders.concat( program[ 'sourceFolders' ] );
  }

  if ( folders.length == 0 && files.length == 0 ) {
    folders.push( process.cwd() );
  }

  folders.forEach( folder => {
    files = files.concat( globby[ 'sync' ]( [ folder + program[ 'filePattern' ] ] ) );
  } );
  return files;
}

function getFolders(): string[] {
  var folders: string[] = [];

  if ( program[ 'sourceFolders' ] ) {
    folders = folders.concat( program[ 'sourceFolders' ] );
  }
  folders.push( process.cwd() );
  return folders;
}

function getTsConfig(): {} {
  var file              = program[ 'tsConfig' ];
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