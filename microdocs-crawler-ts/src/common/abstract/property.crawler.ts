import {AbstractCrawler} from "./abstract.crawler";
import {ProjectReflection} from "typedoc";
import {ContainerReflection, DeclarationReflection} from "typedoc/lib/models";
import {PropertyBuilder} from 'microdocs-core-ts/dist/builder';

export abstract class PropertyCrawler extends AbstractCrawler{

  abstract crawl(propertyBuilder:PropertyBuilder, classReflection: ContainerReflection, propertyReflection:DeclarationReflection):void;

}