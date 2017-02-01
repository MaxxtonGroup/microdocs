import {ProjectReflection} from "@maxxton/typedoc";
import {ReflectionKind, ContainerReflection, DeclarationReflection} from "@maxxton/typedoc/dist/lib/models";
import {AbstractCrawler} from "./abstract/abstract.crawler";
import {ControllerCrawler} from "./abstract/controller.crawler";
import {ClassCrawler} from "./abstract/class.crawler";
import {ComponentCrawler} from "./abstract/component.crawler";
import {ClientCrawler} from "./abstract/client.crawler";
import {PathCrawler} from "./abstract/path.crawler";
import {
  ProjectBuilder,
  DependencyBuilder,
  ComponentBuilder,
  PathBuilder,
  ControllerBuilder
} from '@maxxton/microdocs-core/builder';
import {DependencyTypes} from '@maxxton/microdocs-core/domain/dependency/dependency-type.model'
import {ProjectInfo} from '@maxxton/microdocs-core/domain';
import {ClassIdentity} from "./domain/class-identity";
import {CrawlerException} from "./crawler.exception";
import {ModelCrawler} from "./abstract/model.crawler";
import {PropertyCrawler} from "./abstract/property.crawler";
import {ModelCollector} from "./model.collector";

export class RootCrawler {

  private classCrawlers: ClassCrawler[] = [];
  private componentCrawlers: ComponentCrawler[] = [];
  private controllerCrawlers: ControllerCrawler[] = [];
  private clientCrawlers: ClientCrawler[] = [];
  private pathCrawlers: PathCrawler[] = [];

  private modelCollector:ModelCollector = new ModelCollector();

  /**
   * Register new crawler
   * @param crawler AbstractCrawler
   */
  public registerCrawler(crawler: AbstractCrawler) {
    if (crawler instanceof ClassCrawler) {
      this.classCrawlers.push(crawler);
    } else if (crawler instanceof ControllerCrawler) {
      this.controllerCrawlers.push(crawler);
    } else if (crawler instanceof ClientCrawler) {
      this.clientCrawlers.push(crawler);
    } else if (crawler instanceof ComponentCrawler) {
      this.componentCrawlers.push(crawler);
    } else if (crawler instanceof PathCrawler) {
      this.pathCrawlers.push(crawler);
    } else if (crawler instanceof ModelCrawler) {
      this.modelCollector.addModelCrawler(crawler);
    } else if (crawler instanceof PropertyCrawler) {
      this.modelCollector.addPropertyCrawler(crawler);
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
  public crawl(projectBuilder: ProjectBuilder, projectReflection: ProjectReflection): void {
    if(!projectBuilder.project().info){
      projectBuilder.project().info = <ProjectInfo>{};
    }
    if(projectReflection.packageInfo){
      this.crawlPackageInfo(projectBuilder, projectReflection.packageInfo);
    }


    var flatMap:ContainerReflection[] = [];
    this.collectClasses(projectReflection, flatMap);
    flatMap.forEach(classReflection => {
      this.crawlClass(projectBuilder, projectReflection, classReflection);
    });

    var modelMap = this.modelCollector.collectClasses(flatMap);
    projectBuilder.project().definitions = modelMap;
  }

  public collectClasses(declaration: ContainerReflection, flatMap:ContainerReflection[]){
    if(declaration.children){
      declaration.children.forEach(child => {
        switch (child.kind) {
          case ReflectionKind.ExternalModule:
            this.collectClasses(child, flatMap);
            break;
          case ReflectionKind.Interface:
          case ReflectionKind.Class:
            flatMap.push(child);
            break;
        }
      });
    }
  }

  private crawlPackageInfo(projectBuilder: ProjectBuilder, packageInfo:any){
    if(packageInfo.name){
      var splitted = packageInfo.name.split('/');
      projectBuilder.project().info.title = splitted[splitted.length-1];
    }
    if(packageInfo.version){
      projectBuilder.project().info.version = packageInfo.version;
    }
    if(packageInfo.description){
      projectBuilder.project().info.description = packageInfo.description;
    }
  }

  private triggerCrawlers(crawlers: AbstractCrawler[], call: (c:AbstractCrawler) => void) {
    crawlers.sort((a, b) => a.order - b.order).forEach(crawler => call(crawler));
  }

  /**
   * Crawl every class
   * @param projectBuilder
   * @param projectReflection
   * @param classReflection
   */
  private crawlClass(projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection): void {
    console.info("Crawl class: " + classReflection.name);
    var classIdentity = new ClassIdentity();
    this.triggerCrawlers(this.classCrawlers, (crawler:AbstractCrawler) => crawler.crawl(classIdentity, projectBuilder, projectReflection, classReflection));


    if (classIdentity.isComponent) {
      var componentBuilder = this.crawlComponent(projectReflection, classReflection);
      if (componentBuilder.title) {
        projectBuilder.component(componentBuilder);
      }

      if (classIdentity.isController) {
        var controllerBuilder = this.crawlController(componentBuilder, projectReflection, classReflection);
        projectBuilder.controller(controllerBuilder);
      } else if (classIdentity.isClient) {
        var clientBuilder = this.crawlClient(componentBuilder, projectReflection, classReflection);
        if(!clientBuilder.title){
          clientBuilder.title = componentBuilder.title;
        }
        projectBuilder.dependency(clientBuilder);
      }
    }

    if (classIdentity.isModel) {
      this.modelCollector.collectByName(classReflection.name);
    }
  }

  /**
   * Crawl only controller classes
   * @param componentBuilder
   * @param projectReflection
   * @param classReflection
   * @returns {ControllerBuilder}
   */
  private crawlController(componentBuilder: ComponentBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection): ControllerBuilder {
    var controllerBuilder = new ControllerBuilder();
    this.triggerCrawlers(this.controllerCrawlers, crawler => crawler.crawl(controllerBuilder, projectReflection, classReflection));

    if (classReflection.children) {
      classReflection.children.filter(member => member.kind === ReflectionKind.Method).forEach(methodReflection => {
        var pathBuilder = this.crawlEndpoint(methodReflection, projectReflection, classReflection);
        if (pathBuilder.path) {
          controllerBuilder.path(pathBuilder);
        }
      });
    }
    return controllerBuilder;
  }

  /**
   * Crawl only client classes
   * @param componentBuilder
   * @param projectReflection
   * @param classReflection
   * @returns {DependencyBuilder}
   */
  private crawlClient(componentBuilder: ComponentBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection): DependencyBuilder {
    var clientBuilder = new DependencyBuilder(DependencyTypes.REST);
    this.triggerCrawlers(this.clientCrawlers, crawler => crawler.crawl(clientBuilder, projectReflection, classReflection));

    if (classReflection.children) {
      classReflection.children.filter(member => member.kind === ReflectionKind.Method).forEach(methodReflection => {
        var pathBuilder = this.crawlEndpoint(methodReflection, projectReflection, classReflection);
        if (pathBuilder.path) {
          clientBuilder.path(pathBuilder);
        }
      });
    }
    return clientBuilder;
  }

  /**
   * Crawl components
   * @param projectReflection
   * @param classReflection
   * @returns {ComponentBuilder}
   */
  private crawlComponent(projectReflection: ProjectReflection, classReflection: ContainerReflection): ComponentBuilder {
    var componentBuilder = new ComponentBuilder();
    try {
      this.triggerCrawlers(this.componentCrawlers, crawler => crawler.crawl(componentBuilder, projectReflection, classReflection));
    } catch (e) {
      throw new CrawlerException("Failed to crawl component: " + classReflection.name, e);
    }
    return componentBuilder;
  }

  /**
   * Crawl models
   * @param projectReflection
   * @param classReflection
   * @returns {ModelBuilder}
   */
  // private crawlModel(projectReflection:ProjectReflection, classReflection:ContainerReflection):ModelBuilder {
  //   var modelBuilder = new ModelBuilder();
  //   try {
  //     this.triggerCrawlers(this.modelCrawlers, crawler => crawler.crawl(modelBuilder, projectReflection, classReflection));
  //   } catch (e) {
  //     throw new CrawlerException("Failed to crawl model: " + classReflection.name, e);
  //   }
  //   return modelBuilder;
  // }

  /**
   * Crawl controller methods for endpoints
   * @param methodReflection
   * @param projectReflection
   * @param classReflection
   * @returns {PathBuilder}
   */
  private crawlEndpoint(methodReflection: DeclarationReflection, projectReflection: ProjectReflection, classReflection: ContainerReflection): PathBuilder {
    var pathBuilder = new PathBuilder();
    this.triggerCrawlers(this.pathCrawlers, crawler => crawler.crawl(pathBuilder, projectReflection, classReflection, methodReflection, this.modelCollector));

    return pathBuilder;
  }

}