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
import * as helper from '../common/helpers/crawler.helper';

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
    var tag = this.convertCommentTag(tag);
    var reflectParameter = this.findParameter(signature, tag.paramName);
    if (reflectParameter) {
      var param: Parameter = {
        name: tag.paramName,
        description: tag.text.trim(),
        'in': PATH,
        type: reflectParameter.type.toString(),
        required: true
      };
      if (reflectParameter.defaultValue) {
        try {
          var result = helper.evalArgument(reflectParameter.defaultValue);
          param.default = result;
        } catch (e) {
        }
      }
      if (!pathBuilder.endpoint.parameters) {
        pathBuilder.endpoint.parameters = [];
      }
      pathBuilder.endpoint.parameters.push(param);
    } else {
      throw new Error("Could not find parameter " + tag.paramName);
    }
  }

  private crawlQuery(tag: CommentTag, signature: SignatureReflection, pathBuilder: PathBuilder) {
    var tag = this.convertCommentTag(tag);
    var reflectParameter = this.findParameter(signature, tag.paramName);
    var required = true;
    if (reflectParameter.flags && reflectParameter.flags.length > 0 && reflectParameter.flags[0] === "Optional") {
      required = false;
    }
    if (reflectParameter) {
      var param: Parameter = {
        name: tag.paramName,
        description: tag.text.trim(),
        'in': QUERY,
        type: reflectParameter.type.toString(),
        required: required
      };
      if (reflectParameter.defaultValue) {
        param.required = false;
        try {
          var result = helper.evalArgument(reflectParameter.defaultValue);
          param.default = result;
        } catch (e) {
        }
      }
      if (!pathBuilder.endpoint.parameters) {
        pathBuilder.endpoint.parameters = [];
      }
      pathBuilder.endpoint.parameters.push(param);
    } else {
      throw new Error("Could not find parameter " + tag.paramName);
    }
  }

  private convertCommentTag(tag: CommentTag): CommentTag {
    if (tag.text) {
      var paramName: string;
      var text: string;
      var slices = tag.text.trim().split(" ");
      if (slices.length > 0) {
        paramName = slices[0];
        if (slices.length > 1) {
          for (var i = 1; i < slices.length; i++) {
            if (text) {
              text += ' ' + slices[i];
            } else {
              text = slices[i];
            }
          }
        }
        return new CommentTag(tag.tagName, paramName, text);
      }
    }
    return tag;
  }

  private findParameter(signature: SignatureReflection, paramName: string): ParameterReflection {
    var params = signature.parameters.filter(param => param.name === paramName);
    if (params.length > 0) {
      return params[0];
    }
    return null;
  }

}