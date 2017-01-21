
import * as cliHelper from "../helpers/cli.helper";
import { MicroDocsCrawler } from '../crawler/microdocs-crawler';
import * as globby from 'globby';
import * as fs from 'fs';
import * as path from 'path';
import { ServerOptions } from "../options/server.options";
import { CheckOptions } from "../options/check.options";
import { PublishOptions } from "../options/publish.options";
import IExportedCommand = commander.IExportedCommand;

export function init(program:IExportedCommand) {
  program
      .command( 'build' )
      .description( "Build the microdocs definitions" )
      // default options
      .option( '-s, --source <folder>', 'Add source file', './' )
      .option( '-t, --filePattern <pattern>', 'pattern to match source files', '/**/*.ts' )
      .option( '-c, --tsConfig <file>', 'Set the location of the tsconfig.json', 'tsconfig.json' )
      // addition options
      .option( '-o, --outputFile <file>', 'Set the output file', 'microdocs.json' )
      .action( ( cmd: any ) => {
        var src        = getFiles(cmd);
        var tsConfig   = getTsConfig(cmd);
        var outputFile = getOutputFile( cmd );

        // check input
        if ( !src || src.length == 0 ) {
          console.warn( "Missing input files, use '--source <folder>'" );
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

  function list( val: string ) {
    return val.split( ',' );
  }

  function getFiles(cmd:any): string[] {
    let sourceFolder:string = cmd.source;
    let filePattern:string = cmd.filePattern;
    let pattern:string = path.join(sourceFolder, filePattern);
    let files:string[] = globby[ 'sync' ]( [ pattern ] );
    return files;
  }

  function getTsConfig(cmd:any): {} {
    let tsConfig:string =  cmd['tsConfig'];
    let folders:string[] = [cmd.source, process.cwd()];

    for ( let i = 0; i < folders.length; i++ ) {
      let tsFile = folders[ i ] + '/' + tsConfig;
      if ( fs.existsSync( tsFile ) ) {
        try {
          var json          = require(tsFile);
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

  function getOutputFile( cmd: any ): string {
    return cmd.outputFile ? cmd.outputFile : 'microdocs.json';
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