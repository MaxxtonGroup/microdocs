
import {PathCrawler} from "../common/abstract/path.crawler";
import {ProjectReflection} from "typedoc";
import {ContainerReflection, DeclarationReflection, IDecorator} from "typedoc/lib/models";
import {PathBuilder} from '@maxxton/microdocs-core/builder';
import * as helper from '../common/helpers/crawler.helper';

const HTTP_METHODS = ['get', 'post', 'push', 'delete', 'put', 'head', 'options'];

export class Angular2PathCrawler extends PathCrawler{

  public crawl(pathBuilder: PathBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection, methodReflection:DeclarationReflection): void {
    if (methodReflection.decorators) {
      var methods: string[] = methodReflection.decorators.filter(this.filterRequestMethodDecorators).map(decorator => decorator.name.toLowerCase());
      if (methods.length > 0) {
        pathBuilder.methods = methods;
        pathBuilder.path = helper.evalArgument(methodReflection.decorators.filter(this.filterRequestMethodDecorators)[0].arguments.url);
        if (methodReflection.comment) {
          pathBuilder.endpoint.description = methodReflection.comment.shortText;
        }
        if (methodReflection.signatures) {
          methodReflection.signatures.forEach(signature => {
            pathBuilder.endpoint.operationId = signature.name;
            if (signature.comment) {
              pathBuilder.endpoint.description = signature.comment.shortText;
            }
            if(signature.parameters) {
              signature.parameters.forEach(param => {

              });
            }
          });
        }
      }
    }
  }

  private filterRequestMethodDecorators(decorator: IDecorator):boolean {
    return HTTP_METHODS.filter(method => method === decorator.name.toLowerCase()).length > 0;
  }

}