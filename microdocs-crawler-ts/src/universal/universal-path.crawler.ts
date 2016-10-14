import {PathCrawler} from "../common/abstract/path.crawler";
import {ProjectReflection} from "typedoc";
import {
  ContainerReflection, DeclarationReflection, SignatureReflection, ParameterReflection,
  CommentTag
} from "typedoc/lib/models";
import {PathBuilder} from 'microdocs-core-ts/dist/builder';
import {Parameter} from 'microdocs-core-ts/dist/domain';
import {QUERY, BODY, PATH} from 'microdocs-core-ts/dist/domain/path/parameter-placing.model';
import {HTTP_METHODS} from "../common/domain/http-methods";
import {AbstractCrawler} from "../common/abstract/abstract.crawler";
import * as helper from '../common/helpers';

export class UniversalPathCrawler extends PathCrawler {

  constructor() {
    super(AbstractCrawler.ORDER_LOWER);
  }

  public crawl(pathBuilder: PathBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection, methodReflection: DeclarationReflection): void {
    if (methodReflection.signatures) {
      methodReflection.signatures.forEach(signature => {
        if (signature.comment) {
          var comment = signature.comment;
          if (comment.tags) {
            comment.tags.forEach(tag => {
              if (tag.tagName.indexOf('http') == 0) {
                var methodName = tag.tagName.substring(4);
                if (HTTP_METHODS.indexOf(methodName) != -1) {
                  pathBuilder.methods.push(methodName);
                  if (tag.text && tag.text !== "") {
                    pathBuilder.path = tag.text.trim();
                  }
                }
              }
            });
          }
          if (pathBuilder.path && pathBuilder.path !== "") {
            pathBuilder.endpoint.description = comment.shortText;

            // find query params
            comment.tags.filter(tag => tag.tagName === 'httpquery').forEach(tag => this.crawlQuery(tag, signature, pathBuilder));
            // find path params
            comment.tags.filter(tag => tag.tagName === 'httppath').forEach(tag => this.crawlPath(tag, signature, pathBuilder));
          }
        }
      });
    }
  }

  private crawlPath(tag: CommentTag, signature: SignatureReflection, pathBuilder: PathBuilder) {
    var tag = helper.transformCommentTag(tag);
    var reflectParameter = this.findParameter(signature, tag.paramName);
    var param: Parameter = {
      name: tag.paramName,
      description: tag.text.trim(),
      'in': PATH,
      required: true
    };
    if(reflectParameter) {
      param.type = reflectParameter.type.toString();

      if (reflectParameter.defaultValue) {
        try {
          var result = helper.evalArgument(reflectParameter.defaultValue);
          param.default = result;
        } catch (e) {
        }
      }
    }

    if (!pathBuilder.endpoint.parameters) {
      pathBuilder.endpoint.parameters = [];
    }
    pathBuilder.endpoint.parameters.push(param);
  }

  private crawlQuery(tag: CommentTag, signature: SignatureReflection, pathBuilder: PathBuilder) {
    var tag = helper.transformCommentTag(tag);
    var reflectParameter = this.findParameter(signature, tag.paramName);
    var param: Parameter = {
      name: tag.paramName,
      description: tag.text.trim(),
      'in': QUERY,
      required: true
    };
    if(reflectParameter) {
      param.type = reflectParameter.type.toString();
      if (reflectParameter.flags && reflectParameter.flags.length > 0 && reflectParameter.flags[0] === "Optional") {
        param.required = false;
      }

      if (reflectParameter.defaultValue) {
        param.required = false;
        try {
          var result = helper.evalArgument(reflectParameter.defaultValue);
          param.default = result;
        } catch (e) {
        }
      }
    }
    if(tag.optional){
      param.required = false;
    }

    if (!pathBuilder.endpoint.parameters) {
      pathBuilder.endpoint.parameters = [];
    }
    pathBuilder.endpoint.parameters.push(param);
  }

  private findParameter(signature: SignatureReflection, paramName: string): ParameterReflection {
    var params = signature.parameters.filter(param => param.name === paramName);
    if (params.length > 0) {
      return params[0];
    }
    return null;
  }

}