
import {ProjectReflection} from "typedoc";
import {ContainerReflection} from "typedoc/dist/lib/models";
import {ClassIdentity} from "../domain/class-identity";
import {ProjectBuilder} from '@maxxton/microdocs-core/builder';
import {AbstractCrawler} from "./abstract.crawler";

export abstract class ClassCrawler extends AbstractCrawler{

  abstract crawl(classIdentity: ClassIdentity, projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection):void;

}