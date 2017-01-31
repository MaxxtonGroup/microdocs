
import {ControllerCrawler} from "../common/abstract/controller.crawler";
import {ProjectReflection} from "@maxxton/typedoc";
import {ContainerReflection} from "@maxxton/typedoc/dist/lib/models";
import {ControllerBuilder} from '@maxxton/microdocs-core/builder';

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