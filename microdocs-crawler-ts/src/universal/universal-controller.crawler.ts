
import {ControllerCrawler} from "../common/abstract/controller.crawler";
import {ProjectReflection} from "typedoc";
import {ContainerReflection} from "typedoc/lib/models";
import {ControllerBuilder} from 'microdocs-core-ts/dist/builder';

export class UniversalControllerCrawler extends ControllerCrawler{

  public crawl(controllerBuilder: ControllerBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection): void {
    if (classReflection.comment) {
      var comment = classReflection.comment;
      if (comment.hasTag("baseUrl") && comment.getTag("baseUrl").text && comment.getTag("baseUrl").text !== "") {
        controllerBuilder.baseUrl = classReflection.comment.getTag("baseUrl").text.trim();
      }
    }

  }

}