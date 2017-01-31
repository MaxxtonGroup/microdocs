
import {Command} from 'command-script';
import { MicroDocsCrawler } from "../crawler/microdocs-crawler";
import { JSLogger } from "../helpers/logging/js-logger";
import { Project, ProblemResponse } from "@maxxton/microdocs-core/domain";
import * as cliHelper from '../helpers/cli.helper';
import { ServerOptions } from "../options/server.options";
import { PublishOptions } from "../options/publish.options";

module.exports = new Command("publish")
    .description("Publish the MicroDocs Definition")
    .option('-t, --title <TITLE>', {desc: 'Project title'})
    .option('-v, --tag <VERSION>', {desc: 'Version of the definition'})
    .option('-g, --group <ENV>', {desc: 'Organise the definition into a group'})
    .option('-e, --env <ENV>', {desc: 'Specify the environment'})
    .flag('-f, --force', {desc: 'Publish the new definition, even when there are problems'})
    .extends(require('./cli.build'))
    .extends(require('./cli.login'))
    .action( ( args: { args?: any[], options?: any, flags?: any, pipeResult:any }, resolve: ( result?: any ) => void, reject: ( err?: any ) => void ) => {
      let project:Project = args.pipeResult && args.pipeResult.project;
      let serverOptions:ServerOptions = args.pipeResult && args.pipeResult.server;
      let logger = new JSLogger();
      if(!project){
        reject("Project is missing");
        return;
      }
      if(!serverOptions || !serverOptions.url){
        reject("Project is missing");
        return;
      }
      let publishOptions:PublishOptions = Object.assign(serverOptions, {
        title: args.options.title,
        env: args.options.env,
        version: args.options.tag,
        group: args.options.group,
        force: args.flags['force'] || false
      });
      let crawler = new MicroDocsCrawler( logger );
      crawler.publish(project, publishOptions).then((problemResult:ProblemResponse) => {
        cliHelper.printProblemResponse( problemResult, args.options.source, logger);
        resolve();
      }, reject);
    } );