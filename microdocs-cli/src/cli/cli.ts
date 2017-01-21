#!/usr/bin/env node
/// <reference path="../../typings/index.d.ts" />

import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';
import * as cliCrawler from './cli-crawler';
import * as cliDocker from './cli-docker';

var packageJsonFile = fs.readFileSync(path.join(__dirname, '../../package.json'));

program.version( packageJsonFile.toJSON()['version'] );
program.allowUnknownOption(false);

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
