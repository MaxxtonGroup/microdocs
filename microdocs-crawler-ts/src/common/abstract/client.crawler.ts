import {AbstractCrawler} from "./abstract.crawler";
import {ProjectReflection} from "typedoc";
import {ContainerReflection} from "typedoc/lib/models";
import {DependencyBuilder} from '@maxxton/microdocs-core-ts/dist/builder';

export abstract class ClientCrawler extends AbstractCrawler{

  abstract crawl(dependencyBuilder:DependencyBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection):void;

}