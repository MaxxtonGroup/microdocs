#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';
import * as cliCrawler from './cli-crawler';
import * as cliDocker from './cli-docker';

var packageJsonFile = fs.readFileSync(path.join(__dirname, '../../package.json'));

program.version( packageJsonFile.toJSON()['version'] );
program.allowUnknownOption(false);

program
    .option( '-s, --source <folder>', 'Add source file', './' )
    .option( '-t, --filePattern <pattern>', 'pattern to match source files', '/**/*.ts' )
    .option( '-c, --tsConfig <file>', 'Set the location of the tsconfig.json', 'tsconfig.json' )
    .option( '-o, --outputFile <file>', 'Set the output file', 'microdocs.json' )
    .option( '--no-cache', 'Set the location of the tsconfig.json', 'tsconfig.json' );

cliCrawler.init(program);
cliDocker.init(program);

program
    .command('help')
    .action(function(){
      program.help();
    });

program.parse( process.argv );

program.outputHelp();
process.exit(1);
