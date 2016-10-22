
import {ProjectReflection} from "typedoc";
import {ContainerReflection} from "typedoc/lib/models";
import {ComponentBuilder} from '@maxxton/microdocs-core-ts/dist/builder';
import {AbstractCrawler} from "./abstract.crawler";

export abstract class ComponentCrawler extends AbstractCrawler{

  abstract crawl(componentBuilder:ComponentBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection):void;

}