import {ClientCrawler} from "../common/abstract/client.crawler";
import {ProjectReflection} from "typedoc";
import {ContainerReflection} from "typedoc/dist/lib/models";
import {DependencyBuilder} from '@maxxton/microdocs-core/builder';

export class UniversalClientCrawler extends ClientCrawler {

  public crawl(dependencyBuilder: DependencyBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection): void {
    if (classReflection.comment) {
      var comment = classReflection.comment;
      if (comment.hasTag("client") && comment.getTag("client").text && comment.getTag("client").text !== "") {
        dependencyBuilder.title = classReflection.comment.getTag("client").text.trim();
      }
      if (comment.hasTag("baseUrl") && comment.getTag("baseUrl").text && comment.getTag("baseUrl").text !== "") {
        dependencyBuilder.baseUrl = classReflection.comment.getTag("baseUrl").text.trim();
      }
      dependencyBuilder.dependency.component = {
        $ref: "#/components/" + classReflection.name
      };
    }

  }

}