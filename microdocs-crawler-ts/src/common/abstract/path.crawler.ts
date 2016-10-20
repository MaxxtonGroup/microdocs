import {AbstractCrawler} from "./abstract.crawler";
import {ProjectReflection} from "typedoc";
import {ContainerReflection, DeclarationReflection} from "typedoc/lib/models";
import {PathBuilder} from 'microdocs-core-ts/dist/builder';
import {ModelCollector} from "../model.collector";

export abstract class PathCrawler extends AbstractCrawler{

  abstract crawl(pathBuilder:PathBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection, methodReflection:DeclarationReflection, modelCollector:ModelCollector):void;

}