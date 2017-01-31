import {ContainerReflection} from "@maxxton/typedoc/dist/lib/models";
import {DependencyBuilder, PathBuilder} from '@maxxton/microdocs-core/builder/index';
import {ClientCrawler} from "../common/abstract/client.crawler";
import {ProjectReflection} from "@maxxton/typedoc";
import * as helper from '../common/helpers/crawler.helper';

export class Angular2ClientCrawler extends ClientCrawler{

  public crawl(dependencyBuilder: DependencyBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection): void {
    if (classReflection.comment) {
      dependencyBuilder.dependency.description = classReflection.comment.shortText;
    }

    var baseUrl = '';
    var headers = {};
    if(classReflection.decorators) {
      classReflection.decorators.forEach(decorator => {
        switch (decorator.name) {
          case 'Client':
            var clientArgs = helper.evalArgument(decorator.arguments.args);
            baseUrl = clientArgs.baseUrl;
            dependencyBuilder.title = clientArgs.serviceId;
            headers = clientArgs.headers;
            break;
        }
      });
    }
    dependencyBuilder.baseUrl = baseUrl;
  }
}