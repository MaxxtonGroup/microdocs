import { Project,ProblemResponse, ProblemLevels } from '@maxxton/microdocs-core/domain';
import { ProjectBuilder } from '@maxxton/microdocs-core/builder/index';
import { Application } from "typedoc";
import * as fs from 'fs';
import * as pathUtil from 'path';
import {Client} from 'node-rest-client';

import { RootCrawler } from "./common/root.crawler";
import { CrawlerException } from "./common/crawler.exception";
import { Framework, FRAMEWORKS } from "./frameworks";

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

  public check( sources: string[], checkOptions: CheckOptions, tsConfig: {} = {}, callback:(ProblemResponse)=>void = this.printProblemResponse, frameworks: Framework[] = FRAMEWORKS ): void {
    var project = this.crawl( sources, tsConfig, frameworks );

    var errorHandler = error => {
      var message = "Failed to POST to " + url + " (" + error + ")";
      callback({message: message, status: 'failed'});
    };

    var client:any = this.createClient(checkOptions, errorHandler);

    var params = {};
    if(checkOptions.title){
      params['title'] = checkOptions.title;
    }
    if(checkOptions.env){
      params['env'] = checkOptions.env;
    }
    var options =  {
      parameters: params,
      headers: { 'content-type': 'application/json'},
      data: JSON.stringify(project)
    };
    var url = checkOptions.url + '/api/v1/check';
    console.info("POST " + url);

    client.post(url, options, (data:ProblemResponse, response) => {
      if(response.statusCode == 200){
        callback(data);
      }else{
        var message = "Wrong response status " + response.statusCode + ", expected 200 -> body:\n " + data.toString();
        callback({message: message, status: 'failed'});
      }
    }).on('error', errorHandler);
  }

  public publish( sources: string[], publishOptions: PublishOptions, tsConfig: {} = {}, callback:(ProblemResponse)=>void = this.printProblemResponse, frameworks: Framework[] = FRAMEWORKS ): void {
    var project = this.crawl( sources, tsConfig, frameworks );

    var errorHandler = error => {
      var message = "Failed to PUT to " + url + " (" + error + ")";
      callback({message: message, status: 'failed'});
    };

    var client:any = this.createClient(publishOptions, errorHandler);

    var params = {};
    if(publishOptions.version){
      params['version'] = publishOptions.version;
    }
    if(publishOptions.group){
      params['group'] = publishOptions.group;
    }
    if(publishOptions.env){
      params['env'] = publishOptions.env;
    }
    if(publishOptions.force){
      params['failOnProblems'] = false;
    }
    var options =  {
      parameters: params,
      headers: { 'content-type': 'application/json'},
      data: JSON.stringify(project)
    };
    var url = publishOptions.url + '/api/v1/projects/' + encodeURIComponent(publishOptions.title);
    console.info("PUT " + url);

    client.put(url, options, (data:ProblemResponse, response) => {
      if(response.statusCode == 200){
        callback(data);
      }else{
        var message = "Wrong response status " + response.statusCode + ", expected 200 -> body:\n " + data.toString();
        callback({message: message, status: 'failed'});
      }
    }).on('error', errorHandler);
  }

  private createClient(serverOptions:ServerOptions, errorHandler:(any) => void):Client{
    var authOption = undefined;
    if(serverOptions.username && serverOptions.username !== '' && serverOptions.password){
      authOption = {user: serverOptions.username, password: serverOptions.password};
    }
    var client = new Client(authOption);
   client.on('error', errorHandler);
    return client;
  }

  public printProblemResponse(response:ProblemResponse, folders:string[] = [process.cwd()]):boolean{
    var hasProblems = response.status !== 'ok';
    var errorCount = 0;
    var warningCount = 0;
    var noticeCount = 0;
    if(response.problems){
      errorCount = response.problems.filter(problem => problem.level === ProblemLevels.ERROR).length;
      warningCount = response.problems.filter(problem => problem.level === ProblemLevels.WARNING).length;
      noticeCount = response.problems.filter(problem => problem.level === ProblemLevels.NOTICE).length;
    }

    var message = "\n";
    if(errorCount + warningCount + noticeCount > 0){
      message += "Project contains problems: ";
      if(errorCount > 0){
        message += errorCount + " error" + (errorCount > 1 ? 's' : '') + ',';
      }
      if(warningCount > 0){
        message += warningCount + " warning" + (warningCount > 1 ? 's' : '') + ',';
      }
      if(noticeCount > 0){
        message += noticeCount + " notice" + (noticeCount > 1 ? 's' : '') + ',';
      }
      if(message.indexOf(',', message.length - 1) !== -1){
        message.substring(0, 1);
      }
    }else{
      message += response.message;
    }
    if(hasProblems){
      console.warn(message);
    }else{
      console.info(message);
    }

    if(response.problems){
      response.problems.forEach(problem => {
        var msg = "\n";
        var lineNumber = problem.lineNumber && problem.lineNumber > 0 ? ':' + problem.lineNumber : ':0';
        var path = problem.path;
        if(folders) {
          var matches = folders.filter( folder => fs.existsSync( folder + '/' + path ) );
          if ( matches.length > 0 ) {
            path = matches[ 0 ] + '/' + path;
          }
        }
        var sourceFile = path + lineNumber;
        msg += sourceFile + ": " + problem.level + ": " + problem.message;
        if(problem.client){
          msg += "\nBreaking change detected with " + problem.client.title + " (source: " + problem.client.sourceLink ? problem.client.sourceLink : problem.client.className + " )";
        }
        if(hasProblems){
          console.warn(msg);
        }else{
          console.info(msg);
        }
      });
    }

    return !hasProblems;
  }

}

export interface ServerOptions {

  url: string;
  username?: string;
  password?: string;
}

export interface CheckOptions extends ServerOptions{

  title?: string;
  env?:string;

}

export interface PublishOptions extends CheckOptions{

  version?: string;
  group?: string;
  force?:boolean;

}
