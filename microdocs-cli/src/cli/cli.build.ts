import { Command } from 'command-script';

export default new Command( "build" )
    .description( "Build a MicroDocs definitions from source files" )
    .option( '-s, --source <SOURCE>', { desc: 'Specify the source folder', value: './' } )
    .option( '-t, --patterns <PATTERNS>', { desc: 'patterns to match source files',value: '/**/*.ts,!/**/*.spec.ts',parser: Command.list } )
    .option( '-c, --tsconfig <FILE>', { desc: 'Set the location of the tsconfig.json', value: 'tsconfig.json' } )
    .option( '-d, --definitionFile <FILE>', {desc: 'Set where to store the MicroDocs definitions file',value: 'microdocs.json'} )
    .flag( '--no-cache', { desc: 'Ignore cached definition file' } )
    .flag( '--no-build', { desc: 'Prevent building the definition' } )
    .action( ( args: { args?: any[], options?: any, flags?: any }, resolve: ( result?: any ) => void, reject: ( err?: any ) => void ) => {
      const MicroDocsCrawler = require( '../crawler/microdocs-crawler' ).MicroDocsCrawler;
      const JSLogger         = require( '../helpers/logging/js-logger' ).JSLogger;

      let logger = new JSLogger();
      let crawler = new MicroDocsCrawler( logger );
      crawler.build( {
        source: args.options.source,
        filePatterns: args.options.patterns,
        tsConfig: args.options.tsconfig,
        definitionFile: args.options.definitionFile,
        noCache: args.flags[ 'no-cache' ],
        noBuild: args.flags[ 'no-build' ]
      } ).then( ( project: any ) => {
        logger.info( "Build definitions succeed" );
        resolve( project );
      }, ( err: any ) => {
        reject( err );
      } );
    } );