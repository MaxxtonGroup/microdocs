import {ProjectBuilder} from '@maxxton/microdocs-core/builder';
import {ClassCrawler} from "../common/abstract/class.crawler";
import {ClassIdentity} from "../common/domain/class-identity";
import {ProjectReflection} from "typedoc";
import {ContainerReflection} from "typedoc/dist/lib/models";
import * as helper from "../common/helpers/crawler.helper";

export class Angular2ClassCrawler extends ClassCrawler {

  public crawl(classIdentity: ClassIdentity, projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection): void {
    if (this.isClient(classReflection)) {
      classIdentity.isClient = true;
      classIdentity.isComponent = true;
    } else if (this.isService(classReflection)) {
      classIdentity.isService = true;
      classIdentity.isComponent = true;
    }
  }


  private isClient(classReflection: ContainerReflection): boolean {
    return helper.isSubClassOf(classReflection, "RestClient") && this.isService(classReflection);
  }

  private isService(classReflection: ContainerReflection): boolean {
    return helper.hasDecorator(classReflection, 'Injectable');
  }

}