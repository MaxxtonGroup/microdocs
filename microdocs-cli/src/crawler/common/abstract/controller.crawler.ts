import {AbstractCrawler} from "./abstract.crawler";
import {ProjectReflection} from "@maxxton/typedoc";
import {ContainerReflection} from "@maxxton/typedoc/dist/lib/models";
import {ControllerBuilder} from '@maxxton/microdocs-core/builder';

export abstract class ControllerCrawler extends AbstractCrawler{

  abstract crawl(controllerBuilder:ControllerBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection):void;

}