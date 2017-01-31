import * as cliHelper from "../helpers/cli.helper";
import { MicroDocsCrawler } from '../crawler/microdocs-crawler';
import { ServerOptions } from "../options/server.options";
import { CheckOptions } from "../options/check.options";
import { PublishOptions } from "../options/publish.options";
import { IExportedCommand } from 'commander';
import { JSLogger } from "../helpers/logging/js-logger";
import { Project } from "@maxxton/microdocs-core/domain";

export function init( program: IExportedCommand ) {
  const logger = new JSLogger();


  program
      .command( 'build' )
      .description( "Build the MicroDocs definitions" )
      // default options
      .option( '-s, --source <folder>', 'Add source file', './' )
      .option( '-t, --filePatterns <patterns>', 'patterns to match source files', list, ['/**/*.ts','!/**/*.spec.ts'] )
      .option( '-c, --tsConfig <file>', 'Set the location of the tsconfig.json', 'tsconfig.json' )
      .option( '-o, --outputFile <file>', 'Set the output file', 'microdocs.json' )
      .option( '--no-cache', 'Set the location of the tsconfig.json', 'tsconfig.json' )
      .action( ( cmd: any ) => {
        // build definitions
        var crawler = new MicroDocsCrawler( logger );
        crawler.build( {
          source: cmd.source,
          filePatterns: cmd.filePatterns,
          tsConfig: cmd.tsConfig,
          outputFile: cmd.outputFile,
          noCache: cmd.noCache
        }, ( err: Error, project: Project ) => {
          if(err){
            logger.error(err);
          }else{
            logger.info("Build definitions succeed");
          }
        } );
      } );

  program
      .command( 'check' )
      .description( "Check for breaking changes" )
      // default options
      .option( '-s, --source <folder>', 'Add source file', './' )
      .option( '-t, --filePatterns <patterns>', 'patterns to match source files', list, ['/**/*.ts'] )
      .option( '-c, --tsConfig <file>', 'Set the location of the tsconfig.json', 'tsconfig.json' )
      .option( '--no-cache', 'Force to rebuild the MicroDocs definition' )
      // addition options
      .option( '-p, --project-name <projectTitle>', 'Specify the project name' )
      .option( '-e, --env <env>', "Environment to publish on" )
      .option( '-s, --server <url>', 'Url of the MicroDocs server', 'http://localhost:3000' )
      .option( '-u, --username <user>', 'Username to access the MicroDocs server' )
      .option( '-p, --password <password>', 'Password to access the MicroDocs server' )
      .action( ( env: any ) => {
//        var src          = getFiles();
//        var tsConfig     = getTsConfig();
//        var checkOptinos = getCheckOptions( env );
//
//        // check input
//        if ( !src || src.length == 0 ) {
//          console.warn( "Missing input files, use '--sourceFiles [files] or -sourceFolders [folders]'" );
//          return;
//        }
//        if ( !tsConfig ) {
//          console.warn( "Missing tsConfig file, use '--tsConfig <file>' to specify the tsconfig.json file" );
//          return;
//        }
//
//
//        // build definitions
//        var crawler = new MicroDocsCrawler();
//        crawler.check( src, checkOptinos, tsConfig, result => {
//          cliHelper.printProblemResponse( result, getFolders() );
//        } );
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
//        var src            = getFiles();
//        var tsConfig       = getTsConfig();
//        var publishOptions = getPublishOptions( env );
//
//        // check input
//        if ( !src || src.length == 0 ) {
//          console.warn( "Missing input files, use '--sourceFiles [files] or -sourceFolders [folders]'" );
//          return;
//        }
//        if ( !tsConfig ) {
//          console.warn( "Missing tsConfig file, use '--tsConfig <file>' to specify the tsconfig.json file" );
//          return;
//        }
//        if ( !publishOptions.title || publishOptions.title.trim() === '' ) {
//          console.warn( "Missing project title, use '--title <projecttitle>' to specify title of the project" );
//          return;
//        }
//
//        // build definitions
//        var crawler = new MicroDocsCrawler();
//        crawler.publish( src, publishOptions, tsConfig, result => {
//          cliHelper.printProblemResponse( result, getFolders() );
//        } );
      } );

  function list( val: string ) {
    return val.split( ',' );
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
};