import {ContainerReflection, ReflectionKind, DeclarationReflection, IDecorator} from "typedoc/lib/models";
import {DependencyBuilder, PathBuilder} from 'microdocs-core-ts/dist/builder/index';
import {REST} from 'microdocs-core-ts/dist/domain/dependency/dependency-type.model';

const HTTP_METHODS = ['get', 'post', 'push', 'delete', 'put', 'head', 'options'];

export class ClientCollector {

  collect(classReflection: ContainerReflection): DependencyBuilder {
    var dependencyBuilder = new DependencyBuilder(REST);
    if (classReflection.comment) {
      dependencyBuilder.dependency.description = classReflection.comment.shortText;
    }

    var baseUrl = '';
    var headers = {};
    if(classReflection.decorators) {
      classReflection.decorators.forEach(decorator => {
        switch (decorator.name) {
          case 'Client':
            var clientArgs = this.evalArgument(decorator.arguments.args);
            baseUrl = clientArgs.baseUrl;
            dependencyBuilder.title = clientArgs.serviceId;
            headers = clientArgs.headers;
            break;
        }
      });
    }

    if (classReflection.children) {
      classReflection.children.filter(member => member.kind === ReflectionKind.Method).forEach(method => {
        this.collectEndpoint(method, baseUrl, dependencyBuilder);
      });
    }

    return dependencyBuilder;
  }


  private collectEndpoint(method: DeclarationReflection, baseUrl, dependencyBuilder: DependencyBuilder): void {
    if (method.decorators) {
      var methods: string[] = method.decorators.filter(this.filterRequestMethodDecorators).map(decorator => decorator.name.toLowerCase());
      if (methods.length > 0) {
        var pathBuilder = new PathBuilder();
        pathBuilder.methods = methods;
        pathBuilder.path = baseUrl + this.evalArgument(method.decorators.filter(this.filterRequestMethodDecorators)[0].arguments.url);
        if (method.comment) {
          pathBuilder.endpoint.description = method.comment.shortText;
        }
        if (method.signatures) {
          method.signatures.forEach(signature => {
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


        dependencyBuilder.path(pathBuilder);
      }
    }
  }

  private filterRequestMethodDecorators(decorator: IDecorator):boolean {
    return HTTP_METHODS.filter(method => method === decorator.name.toLowerCase()).length > 0;
  }

  private evalArgument(arg: string) {
    return eval("(" + arg + ")");
  }
}