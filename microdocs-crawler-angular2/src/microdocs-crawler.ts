import {Project} from 'microdocs-core-ts/dist/domain/index';
import {ProjectBuilder} from 'microdocs-core-ts/dist/builder/index';
import {Application} from "typedoc";

import {RootCrawler} from "./common/root.crawler";
import {CrawlerException} from "./common/crawler.exception";
import {Framework, FRAMEWORKS} from "./frameworks";

/**
 * Base crawler to crawl Typescript sources
 */
export class MicroDocsCrawler {

  /**
   * Start Crawling
   * @param sources entry points to start crawling
   * @param frameworks which frameworks it should crawl for
   * @returns {Project} MicroDocs definition
   */
  public crawl(sources: string[], frameworks: Framework[] = FRAMEWORKS): Project {
    // Check frameworks
    if (frameworks.length == 0) {
      throw new CrawlerException('No framework selected');
    }

    // Convert source to reflection
    console.info('Crawl sources');
    var typedocApplication = new Application({ignoreCompilerErrors: true});
    var reflect = typedocApplication.convert(sources);

    // Init Crawling
    var rootCrawler = new RootCrawler();
    frameworks.forEach(framework => {
      framework.initCrawlers().forEach(crawler => rootCrawler.registerCrawler(crawler));
    });

    // Start Crawling
    var projectBuilder = new ProjectBuilder();
    rootCrawler.crawl(projectBuilder, reflect);

    return projectBuilder.build();
  }

}

