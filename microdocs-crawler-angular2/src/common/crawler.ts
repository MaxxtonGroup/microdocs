import {ProjectReflection} from "typedoc";
import {ReflectionKind, ContainerReflection} from "typedoc/lib/models";
import {ClassCrawler} from "./abstract/class-crawler";
import {ClassIdentity} from "./domain/class-identity";
import {ProjectBuilder} from 'microdocs-core-ts/dist/builder';
import {CrawlerException} from "../crawler.exception";
import {AbstractCrawler} from "./abstract/abstract-crawler";
import {ControllerCrawler} from "./abstract/controller-crawler";
import {PathBuilder} from "../../../microdocs-core-ts/src/builder/path.builder";
import {ComponentBuilder} from "../../../microdocs-core-ts/src/builder/component.builder";
import {DependencyBuilder} from "../../../microdocs-core-ts/src/builder/dependency.builder";

export class Crawler {
  
  private classCrawlers:ClassCrawler[] = [];
  private controllerCrawlers:ControllerCrawler[] = [];
  
  /**
   * Register new crawler
   * @param crawler AbstractCrawler
   */
  public registerCrawler(crawler:AbstractCrawler) {
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
  public crawl(projectBuilder:ProjectBuilder, projectReflection:ProjectReflection, declaration?:ContainerReflection):void {
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
  
  private triggerCrawlers(crawlers:AbstractCrawler[], call:(AbstractCrawler) => void) {
    crawlers.sort((a, b) => a.order - b.order).forEach(crawler => call(crawler));
  }
  
  /**
   * Crawl every class
   * @param projectBuilder
   * @param projectReflection
   * @param classReflection
   */
  private crawlClass(projectBuilder:ProjectBuilder, projectReflection:ProjectReflection, classReflection:ContainerReflection):void {
    var classIdentity = new ClassIdentity();
    try {
      this.triggerCrawlers(this.classCrawlers, (crawler) => crawler.crawl(classIdentity, projectBuilder, projectReflection, classReflection));
    } catch (e) {
      throw new CrawlerException("Failed to crawl class: " + classReflection.name, e);
    }
    
    if (classIdentity.isComponent) {
      var componentBuilder = this.crawlComponent(projectReflection, classReflection);
      projectBuilder.component(componentBuilder);
      
      if (classIdentity.isController) {
        var controllerBuilder = this.crawlController(componentBuilder, projectReflection, classReflection);
        projectBuilder.controller(controllerBuilder);
      } else if (classIdentity.isClient) {
        var clientBuilder = this.crawlClient(componentBuilder, projectReflection, classReflection);
        projectBuilder.dependency(clientBuilder);
      }
    }
    if (classIdentity.isModel) {
      var model = this.crawlModel(projectReflection, classReflection);
      projectBuilder.model(model);
    }
  }
  
  private crawlController(componentBuilder:ComponentBuilder, projectReflection:ProjectReflection, classReflection:ContainerReflection):ControllerBuilder {
    var controllerBuilder = new ControllerBuilder();
    try {
      this.triggerCrawlers(this.controllerCrawlers, crawler => crawler.crawl(controllerBuilder, projectReflection, classReflection));
    } catch (e) {
      throw new CrawlerException("Failed to crawl controller: " + classReflection.name, e);
    }
    
    if (classReflection.children) {
      classReflection.children.filter(member => member.kind === ReflectionKind.Method).forEach(methodReflection => {
        var pathBuilder = this.crawlEndpoint(methodReflection, projectReflection, classReflection);
        controllerBuilder.path(pathBuilder);
      });
    }
    return controllerBuilder;
  }
  
  private crawlClient(componentBuilder:ComponentBuilder, projectReflection:ProjectReflection, classReflection:ContainerReflection):DependencyBuilder {
    var clientBuilder = new DependencyBuilder();
    try {
      this.triggerCrawlers(this.clientCrawlers, crawler => crawler.crawl(clientBuilder, projectReflection, classReflection));
    } catch (e) {
      throw new CrawlerException("Failed to crawl client: " + classReflection.name, e);
    }
    
    if (classReflection.children) {
      classReflection.children.filter(member => member.kind === ReflectionKind.Method).forEach(methodReflection => {
        var pathBuilder = this.crawlEndpoint(methodReflection, projectReflection, classReflection);
        clientBuilder.path(pathBuilder);
      });
    }
    return clientBuilder;
  }
  
  private crawlComponent(projectReflection:ProjectReflection, classReflection:ContainerReflection):ComponentBuilder {
    var componentBuilder = new ComponentBuilder();
    try {
      this.triggerCrawlers(this.componentCrawlers, crawler => crawler.crawl(componentBuilder, projectReflection, classReflection));
    } catch (e) {
      throw new CrawlerException("Failed to crawl component: " + classReflection.name, e);
    }
    return componentBuilder;
  }
  
  private crawlModel(projectReflection:ProjectReflection, classReflection:ContainerReflection):ModelBuilder {
    var modelBuilder = new ModelBuilder();
    try {
      this.triggerCrawlers(this.modelCrawlers, crawler => crawler.crawl(modelBuilder, projectReflection, classReflection));
    } catch (e) {
      throw new CrawlerException("Failed to crawl model: " + classReflection.name, e);
    }
    return modelBuilder;
  }
  
  private crawlEndpoint(methodReflection:DeclarationReflection, projectReflection:ProjectReflection, classReflection:ContainerReflection):PathBuilder {
    var pathBuilder = new PathBuilder();
    try {
      this.triggerCrawlers(this.pathCrawlers, crawler => crawler.crawl(pathBuilder, projectReflection, classReflection));
    } catch (e) {
      throw new CrawlerException("Failed to crawl endpoint: " + classReflection.name, e);
    }
    return pathBuilder;
  }
  
}