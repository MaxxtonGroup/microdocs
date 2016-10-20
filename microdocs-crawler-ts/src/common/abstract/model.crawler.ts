
import {AbstractCrawler} from "./abstract.crawler";
import {ContainerReflection} from "typedoc/lib/models";
import {ModelBuilder} from 'microdocs-core-ts/dist/builder';

export abstract class ModelCrawler extends AbstractCrawler{

  abstract crawl(modelBuilder:ModelBuilder, classReflection: ContainerReflection):void;

}