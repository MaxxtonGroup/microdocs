import {AbstractCrawler} from "./abstract-crawler";
import {ControllerIdentity} from "../domain/controller-identity";
import {ProjectReflection} from "typedoc";
import {ContainerReflection} from "typedoc/lib/models";
import {ProjectBuilder} from 'microdocs-core-ts/dist/builder';

export abstract class ControllerCrawler extends AbstractCrawler{

  abstract crawl(classIdentity: ControllerIdentity, projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection):void;

}