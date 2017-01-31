import {AbstractCrawler} from "./abstract.crawler";
import {ProjectReflection} from "@maxxton/typedoc";
import {ContainerReflection} from "@maxxton/typedoc/dist/lib/models";
import {DependencyBuilder} from '@maxxton/microdocs-core/builder';

export abstract class ClientCrawler extends AbstractCrawler{

  abstract crawl(dependencyBuilder:DependencyBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection):void;

}