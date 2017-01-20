import { Project,ProblemResponse, ProblemLevels } from '@maxxton/microdocs-core/domain';
import { ProjectBuilder } from '@maxxton/microdocs-core/builder/index';
import { Application } from "@maxxton/typedoc";
import * as fs from 'fs';
import * as pathUtil from 'path';

import { RootCrawler } from "./common/root.crawler";
import { CrawlerException } from "./common/crawler.exception";
import { Framework, FRAMEWORKS } from "./frameworks";
import { ServerOptions } from "../options/server.options";
import { CheckOptions } from "../options/check.options";
import { MicroDocsClient } from "../helpers/microdocs-client";
import * as cliHelper from '../helpers/cli.helper';
import { PublishOptions } from "../options/publish.options";

/**
 * Base crawler to crawl Typescript sources
 */
export class MicroDocsCrawler {

  /**
   * Start Crawling
   * @param sources entry points to start crawling
   * @param tsConfig typescript compiler options
   * @param frameworks which frameworks it should crawl for
   * @returns {Project} MicroDocs definition
   */
  public crawl( sources: string[], tsConfig: {} = {}, frameworks: Framework[] = FRAMEWORKS ): Project {
    // Check frameworks
    if ( frameworks.length == 0 ) {
      throw new CrawlerException( 'No framework selected' );
    }

    // Convert source to reflection
    console.info( 'Crawl sources with config:' );
    console.info( JSON.stringify( tsConfig, undefined, 2 ) );
    var typedocApplication = new Application( tsConfig );
    var reflect            = typedocApplication.convert( sources );

    if(!reflect){
      throw new Error("Compiling failed");
    }

    // Init Crawling
    var rootCrawler = new RootCrawler();
    frameworks.forEach( framework => {
      framework.initCrawlers().forEach( crawler => rootCrawler.registerCrawler( crawler ) );
    } );

    // Start Crawling
    var projectBuilder = new ProjectBuilder();
    rootCrawler.crawl( projectBuilder, reflect );

    return projectBuilder.build();
  }

  /**
   * Crawl project definitions and save it as json in the defined outputFile
   * @param sources entry points to start crawling
   * @param outputFile file to save the microdocs definitions
   * @param tsConfig typescript compiler options
   * @param frameworks which frameworks it should crawl for
   */
  public build( sources: string[], outputFile: string = "microdocs.json", tsConfig: {} = {}, frameworks: Framework[] = FRAMEWORKS ): void {
    var project = this.crawl( sources, tsConfig, frameworks );

    var json = JSON.stringify( project );
    fs.writeFileSync( outputFile, json );
  }

  public check( sources: string[], checkOptions: CheckOptions, tsConfig: {} = {}, callback:(response:ProblemResponse)=>void = cliHelper.printProblemResponse, frameworks: Framework[] = FRAMEWORKS ): void {
    var project = this.crawl( sources, tsConfig, frameworks );

    new MicroDocsClient().check(checkOptions, project, callback);
  }

  public publish( sources: string[], publishOptions: PublishOptions, tsConfig: {} = {}, callback:(response:ProblemResponse)=>void = cliHelper.printProblemResponse, frameworks: Framework[] = FRAMEWORKS ): void {
    var project = this.crawl( sources, tsConfig, frameworks );

    new MicroDocsClient().publish(publishOptions, project, callback);
  }

}


