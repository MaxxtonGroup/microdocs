import {AbstractCrawler} from "./abstract.crawler";
import {ProjectReflection} from "typedoc";
import {ContainerReflection} from "typedoc/lib/models";
import {ControllerBuilder} from 'microdocs-core-ts/dist/builder';

export abstract class ControllerCrawler extends AbstractCrawler{

  abstract crawl(controllerBuilder:ControllerBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection):void;

}