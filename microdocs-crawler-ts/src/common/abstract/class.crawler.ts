
import {ProjectReflection} from "typedoc";
import {ContainerReflection} from "typedoc/lib/models";
import {ClassIdentity} from "../domain/class-identity";
import {ProjectBuilder} from 'microdocs-core-ts/dist/builder';
import {AbstractCrawler} from "./abstract.crawler";

export abstract class ClassCrawler extends AbstractCrawler{

  abstract crawl(classIdentity: ClassIdentity, projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection):void;

}