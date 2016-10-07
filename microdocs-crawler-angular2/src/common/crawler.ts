import {ProjectReflection} from "typedoc";
import {ReflectionKind, ContainerReflection} from "typedoc/lib/models";
import {ClassCrawler} from "./abstract/class-crawler";
import {ClassIdentity} from "./domain/class-identity";
import {ProjectBuilder} from 'microdocs-core-ts/dist/builder';
import {CrawlerException} from "../crawler.exception";
import {AbstractCrawler} from "./abstract/abstract-crawler";
import {ControllerIdentity} from "./domain/controller-identity";
import {ControllerCrawler} from "./abstract/controller-crawler";

export class Crawler {

  private classCrawlers: ClassCrawler[] = [];
  private controllerCrawlers: ControllerCrawler[] = [];

  /**
   * Register new crawler
   * @param crawler AbstractCrawler
   */
  public registerCrawler(crawler: AbstractCrawler) {
    if (crawler instanceof ClassCrawler) {
      this.classCrawlers.push(crawler);
    } else if (crawler instanceof ControllerCrawler) {
      this.controllerCrawlers.push(crawler);
    } else {
      throw new CrawlerException("Unknown crawler type: " + typeof(crawler));
    }
  }

  /**
   * Start crawling
   * @param projectBuilder
   * @param projectReflection
   * @param declaration
   */
  public crawl(projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, declaration?: ContainerReflection): void {
    if (!declaration) {
      declaration = projectReflection;
    }
    if (declaration.children) {
      declaration.children.forEach(ref => {
        switch (ref.kind) {
          case ReflectionKind.ExternalModule:
            this.crawl(projectBuilder, projectReflection, ref);
            break;
          case ReflectionKind.Class:
            this.crawlClass(projectBuilder, projectReflection, ref);
        }
      });
    }
  }

  /**
   * Crawl every class
   * @param projectBuilder
   * @param projectReflection
   * @param classReflection
   */
  private crawlClass(projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection): void {
    var classIdentity = new ClassIdentity();
    for (var i = 0; i < this.classCrawlers.length; i++) {
      var classCrawler = this.classCrawlers[i];
      try {
        classCrawler.crawl(classIdentity, projectBuilder, projectReflection, classReflection);
      } catch (e) {
        throw new CrawlerException("Failed to crawl class: " + classReflection.name, e);
      }
    }

    if (classIdentity.isController) {
      this.crawlController(projectBuilder, projectReflection, classReflection);
    } else if (classIdentity.isClient) {
      crawlClient();
    } else if (classIdentity.isService) {
      crawlService();
    } else if (classIdentity.isComponent) {
      crawlComponent();
    } else if (classIdentity.isModel) {
      crawlModel();
    }

    if (classIdentity.isController || classIdentity.isClient) {

    }
  }

  private crawlController(projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection) {
    var controllerIdentity = new ControllerIdentity();
    for (var i = 0; i < this.controllerCrawlers.length; i++) {
      var controllerCrawler = this.controllerCrawlers[i];
      try {
        controllerCrawler.crawl(controllerIdentity, projectBuilder, projectReflection, classReflection);
      } catch (e) {
        throw new CrawlerException("Failed to crawl controller: " + classReflection.name, e);
      }
    }
  }

  private crawlClient() {
  }

  private crawlService() {
  }

  private crawlComponent() {
  }

  private crawlModel() {
  }

  private crawlEndpoint() {
  }

}