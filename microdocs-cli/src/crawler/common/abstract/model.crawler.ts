
import {AbstractCrawler} from "./abstract.crawler";
import {ContainerReflection} from "@maxxton/typedoc/dist/lib/models";
import {ModelBuilder} from '@maxxton/microdocs-core/builder';

export abstract class ModelCrawler extends AbstractCrawler{

  abstract crawl(modelBuilder:ModelBuilder, classReflection: ContainerReflection):void;

}