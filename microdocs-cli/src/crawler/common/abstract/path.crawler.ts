import {AbstractCrawler} from "./abstract.crawler";
import {ProjectReflection} from "typedoc";
import {ContainerReflection, DeclarationReflection} from "typedoc/dist/lib/models";
import {PathBuilder} from '@maxxton/microdocs-core/builder';
import {ModelCollector} from "../model.collector";

export abstract class PathCrawler extends AbstractCrawler{

  abstract crawl(pathBuilder:PathBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection, methodReflection:DeclarationReflection, modelCollector:ModelCollector):void;

}