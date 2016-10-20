import {PathCrawler} from "../common/abstract/path.crawler";
import {ProjectReflection} from "typedoc";
import {
  ContainerReflection, DeclarationReflection, SignatureReflection, ParameterReflection,
  CommentTag
} from "typedoc/lib/models";
import {PathBuilder} from 'microdocs-core-ts/dist/builder';
import {Parameter, SchemaTypes, ParameterPlacings, Schema, ResponseModel} from 'microdocs-core-ts/dist/domain';
import {SchemaHelper} from 'microdocs-core-ts/dist/helpers';
import {HTTP_METHODS} from "../common/domain/http-methods";
import {AbstractCrawler} from "../common/abstract/abstract.crawler";
import * as helper from '../common/helpers';
import {ModelCollector} from "../common/model.collector";

export class UniversalPathCrawler extends PathCrawler {

  constructor() {
    super(AbstractCrawler.ORDER_LOWER);
  }

  public crawl(pathBuilder: PathBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection, methodReflection: DeclarationReflection, modelCollector:ModelCollector): void {
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
            comment.tags.filter(tag => tag.tagName === 'httpquery').forEach(tag => this.crawlQuery(tag, signature, pathBuilder, modelCollector));
            // find path params
            comment.tags.filter(tag => tag.tagName === 'httppath').forEach(tag => this.crawlPath(tag, signature, pathBuilder, modelCollector));
            // find body params
            comment.tags.filter(tag => tag.tagName === 'httpbody').forEach(tag => this.crawlBody(tag, signature, pathBuilder, modelCollector));
            // find responses
            comment.tags.filter(tag => tag.tagName === 'httpresponse').forEach(tag => this.crawlResponse(tag, signature, pathBuilder, modelCollector));
          }
        }
      });
    }
  }

  private crawlQuery(tag: CommentTag, signature: SignatureReflection, pathBuilder: PathBuilder, modelCollector:ModelCollector) {
    var param = this.buildParam(tag, signature, ParameterPlacings.QUERY, modelCollector);
    if (!param.name || param.name.trim() === '') {
      console.warn("a parameter name is required for '@" + tag.tagName + " " + tag.text + "'");
    } else {
      if (!pathBuilder.endpoint.parameters) {
        pathBuilder.endpoint.parameters = [];
      }
      pathBuilder.endpoint.parameters.push(param);
    }
  }

  private crawlPath(tag: CommentTag, signature: SignatureReflection, pathBuilder: PathBuilder, modelCollector:ModelCollector) {
    var param = this.buildParam(tag, signature, ParameterPlacings.PATH, modelCollector);
    param.required = true;
    if (!param.name || param.name.trim() === '') {
      console.warn("a parameter name is required for '@" + tag.tagName + " " + tag.text + "'");
    } else {
      if (!pathBuilder.endpoint.parameters) {
        pathBuilder.endpoint.parameters = [];
      }
      pathBuilder.endpoint.parameters.push(param);
    }
  }

  private crawlBody(tag: CommentTag, signature: SignatureReflection, pathBuilder: PathBuilder, modelCollector:ModelCollector) {
    var param = this.buildParam(tag, signature, ParameterPlacings.BODY, modelCollector);
    if (!pathBuilder.endpoint.parameters) {
      pathBuilder.endpoint.parameters = [];
    }
    pathBuilder.endpoint.parameters.push(param);
  }

  private crawlResponse(tag: CommentTag, signature: SignatureReflection, pathBuilder: PathBuilder, modelCollector:ModelCollector) {
    var tag = helper.transformCommentTag(tag);
    var status = tag.paramName ? tag.paramName : 'default';
    var description = tag.text;
    var defaultValue: any = null;
    var schema: Schema = null;

    if (tag.defaultValue) {
      defaultValue = helper.evalArgument(tag.defaultValue);
    }
    if (tag.type) {
      schema = modelCollector.collectByType(tag.type);
    }

    var response:ResponseModel = {};
    if(description){
      response.description = description;
    }
    if(schema != null){
      if(defaultValue != null){
        schema['default'] = defaultValue;
      }
      response.schema = schema;
    }

    if(!pathBuilder.endpoint.responses){
      pathBuilder.endpoint.responses = {};
    }
    pathBuilder.endpoint.responses[status] = response;
  }

  private buildParam(tag: CommentTag, signature: SignatureReflection, placing: string, modelCollector:ModelCollector): Parameter {
    var tag = helper.transformCommentTag(tag, placing === ParameterPlacings.BODY);
    var name: string = tag.paramName;
    var description: string = tag.text;
    var required: boolean = !tag.optional;
    var defaultValue: any = null;
    var schema: Schema;

    if (tag.defaultValue) {
      defaultValue = helper.evalArgument(tag.defaultValue);
    }
    if (tag.type) {
      schema = modelCollector.collectByType(tag.type);
    }

    var reflectParameter = this.findParameter(signature, tag.paramName);
    if (reflectParameter) {
      if (required) {
        if (reflectParameter.flags && reflectParameter.flags.filter(flag => flag === "Optional").length > 0) {
          required = false;
        }
      }
      if (defaultValue != null) {
        try {
          var result = helper.evalArgument(reflectParameter.defaultValue);
          defaultValue = result;
        } catch (e) {
        }
      }
      if (!schema) {
        schema = modelCollector.collectByType(reflectParameter.type.toString());
      }
    }
    if (defaultValue != null) {
      required = false;
    }

    var param: Parameter = {
      name: name,
      description: description,
      'in': placing,
      required: required
    };

    if (schema) {
      if (placing !== ParameterPlacings.BODY) {
        if(schema.$ref){
          schema.type = SchemaTypes.OBJECT;
        }
        var allowedTypes = [SchemaTypes.STRING, SchemaTypes.NUMBER, SchemaTypes.INTEGER, SchemaTypes.BOOLEAN, SchemaTypes.ARRAY];
        if (allowedTypes.indexOf(schema.type) == -1) {
          console.warn("type " + schema.type + " is not allowed for query param '" + name + "'");
        }
        if (defaultValue != null) {
          param['default'] = defaultValue;
        }
        param.type = schema.type;
      } else {
        if (defaultValue != null) {
          schema['default'] = defaultValue;
        }
        param.schema = schema;
      }
    }

    return param;
  }

  private findParameter(signature: SignatureReflection, paramName: string): ParameterReflection {
    var params = signature.parameters.filter(param => param.name === paramName);
    if (params.length > 0) {
      return params[0];
    }
    return null;
  }

}