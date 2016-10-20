#!/usr/bin/env node
/// <reference path="../typings/index.d.ts" />

import * as pjson from '../package.json';
import * as program from 'commander';
import * as globby from 'globby';
import * as fs from 'fs';
import {MicroDocsCrawler} from 'microdocs-crawler';

function list(val) {
  return val.split(',');
}

program
  .version(pjson.version)
  .option('-s, --sourceFiles [files]', 'Add source file', list)
  .option('-f, --sourceFolders [folders]', 'Add source folders', list)
  .option('-o, --outputFile <file>', 'Set the output file', 'microdocs.json')
  .option('-c, --compilerOption <option> <value>', 'Add a compiler option')
  .parse(process.argv);

var folders:string[] = [];
var files:string[] = [];

if(program.sourceFiles){
  files = files.concat(list.sourceFiles);
}

if(program.sourceFolders){
  folders = folders.concat(program.sourceFolders);
}

if(folders.length == 0 && files.length == 0){
  folders.push(__dirname);
}

folders.forEach(folder => {
  files = files.concat(globby.sync([folder + "/**/*.ts"]));
});

var crawler = new MicroDocsCrawler();
var project = crawler.crawl(files);

fs.writeFileSync(program.outputFile, JSON.stringify(project));