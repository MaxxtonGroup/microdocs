import {Project} from 'microdocs-core-ts/dist/domain/index';
import {ProjectBuilder} from 'microdocs-core-ts/dist/builder/index';
import {Application} from "typedoc";
import {Angular2Crawler} from "./angular2/angular2-crawler";
import {Crawler} from "./common/crawler";

/**
 * Base crawler to crawl Typescript sources
 */
export class TypescriptCrawler {

  /**
   * Start Crawling
   * @param sources entry points to start crawling
   * @param frameworks which frameworks it should crawl for
   * @returns {Project} MicroDocs definition
   */
  public crawl(sources: string[], frameworks: Framework[] = FRAMEWORKS): Project {
    // Get Crawlers
    var crawlers: Crawler[] = [];
    frameworks.forEach(framework => {
      switch (framework) {
        case Framework.ANGULAR2:
          crawlers.push(new Angular2Crawler());
          break;
        default:
          throw new CrawlerException('Unknown framework: ' + framework);
      }
    });

    if (crawlers.length == 0) {
      throw new CrawlerException('No framework selected');
    }

    // Convert source to reflection
    console.info('Crawl sources');
    var typedocApplication = new Application({ignoreCompilerErrors: true});
    var reflect = typedocApplication.convert(sources);

    // Start Crawling
    var projectBuilder = new ProjectBuilder();
    crawlers.forEach(crawler => {
      crawler.crawl(projectBuilder, reflect);
    });

    return projectBuilder.build();
  }

}

/**
 * Supported frameworks
 */
export class Framework {
  public static ANGULAR2: string = "angular2";
}
const FRAMEWORKS: Framework[] = [Framework.ANGULAR2];

/**
 * CrawlerException
 */
export class CrawlerException extends Error {

  constructor(msg: string) {
    super(msg);
  }

}