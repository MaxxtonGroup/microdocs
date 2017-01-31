import {AbstractCrawler} from "./abstract.crawler";
import {ProjectReflection} from "@maxxton/typedoc";
import {ContainerReflection, DeclarationReflection} from "@maxxton/typedoc/dist/lib/models";
import {PropertyBuilder} from '@maxxton/microdocs-core/builder';

export abstract class PropertyCrawler extends AbstractCrawler{

  abstract crawl(propertyBuilder:PropertyBuilder, classReflection: ContainerReflection, propertyReflection:DeclarationReflection):void;

}