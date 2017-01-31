import { PathCrawler } from "../common/abstract/path.crawler";
import { ProjectReflection } from "@maxxton/typedoc";
import {
  ContainerReflection,
  DeclarationReflection,
  IDecorator,
  ParameterReflection,
  SignatureReflection,
  ReferenceType,
  IntrinsicType,
  Type
} from "@maxxton/typedoc/dist/lib/models";
import { PathBuilder } from "@maxxton/microdocs-core/builder";
import * as helper from "../common/helpers/crawler.helper";
import { Parameter, ParameterPlacings } from "@maxxton/microdocs-core/domain";
import { ModelCollector } from "../common/model.collector";

const HTTP_METHODS = [ 'get', 'post', 'push', 'delete', 'put', 'head', 'options' ];

export class Angular2PathCrawler extends PathCrawler {

  public crawl( pathBuilder: PathBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection, methodReflection: DeclarationReflection, modelCollector: ModelCollector ): void {
    if ( methodReflection.decorators ) {
      var methods: string[] = methodReflection.decorators.filter( this.filterRequestMethodDecorators ).map( decorator => decorator.name.toLowerCase() );
      if ( methods.length > 0 ) {
        pathBuilder.methods = methods;
        pathBuilder.path    = helper.evalArgument( methodReflection.decorators.filter( this.filterRequestMethodDecorators )[ 0 ].arguments.url );
        if ( methodReflection.comment ) {
          pathBuilder.endpoint.description = methodReflection.comment.shortText;
        }
        if ( methodReflection.signatures ) {
          methodReflection.signatures.forEach( signature => {
            pathBuilder.endpoint.operationId = signature.name;
            if ( signature.comment ) {
              pathBuilder.endpoint.description = signature.comment.shortText;
            }
            if ( signature.parameters ) {
              signature.parameters.filter( param => param.decorators ).forEach( param => {
                param.decorators.forEach( decorator => {
                  switch ( decorator.name ) {
                    case 'Path':
                      let pathParam: Parameter        = this.crawlPathParam( param, decorator, signature, modelCollector );
                      pathBuilder.endpoint.parameters = pathBuilder.endpoint.parameters || [];
                      pathBuilder.endpoint.parameters.push( pathParam );
                      break;
                    case 'Query':
                      let queryParam: Parameter       = this.crawlQueryParam( param, decorator, signature, modelCollector );
                      pathBuilder.endpoint.parameters = pathBuilder.endpoint.parameters || [];
                      pathBuilder.endpoint.parameters.push( queryParam );
                      break;
                    case 'Body':
                      let bodyParam: Parameter        = this.crawlBodyParam( param, decorator, signature, modelCollector );
                      pathBuilder.endpoint.parameters = pathBuilder.endpoint.parameters || [];
                      pathBuilder.endpoint.parameters.push( bodyParam );
                      break;
                  }
                } );
              } );
            }
            if ( signature.type ) {
              let typeString = this.typeToString(signature.type);
              let schema = modelCollector.collectByType(typeString);
              if(!pathBuilder.endpoint.responses){
                pathBuilder.endpoint.responses = {};
              }
              if(!pathBuilder.endpoint.responses['default']){
                pathBuilder.endpoint.responses['default'] = {};
              }
              pathBuilder.endpoint.responses['default'].schema = schema;
            }
          } );
        }
      }
    }
  }

  private filterRequestMethodDecorators( decorator: IDecorator ): boolean {
    return HTTP_METHODS.filter( method => method === decorator.name.toLowerCase() ).length > 0;
  }

  private crawlPathParam( param: ParameterReflection, decorator: IDecorator, signature: SignatureReflection, modelCollector: ModelCollector ): Parameter {
    let parameter = this.buildParam( param, ParameterPlacings.PATH, decorator, signature, modelCollector );
    return parameter;
  }

  private crawlQueryParam( param: ParameterReflection, decorator: IDecorator, signature: SignatureReflection, modelCollector: ModelCollector ): Parameter {
    let parameter = this.buildParam( param, ParameterPlacings.QUERY, decorator, signature, modelCollector );
    return parameter;
  }

  private crawlBodyParam( param: ParameterReflection, decorator: IDecorator, signature: SignatureReflection, modelCollector: ModelCollector ): Parameter {
    let parameter  = this.buildParam( param, ParameterPlacings.BODY, decorator, signature, modelCollector );
    parameter.name = 'body';
    return parameter;
  }

  private buildParam( param: ParameterReflection, placing: string, decorator: IDecorator, signature: SignatureReflection, modelCollector: ModelCollector ): Parameter {
    let parameter: Parameter = {};
    if ( decorator.arguments && decorator.arguments.name ) {
      parameter.name = helper.evalArgument( decorator.arguments.name );
    }
    parameter[ 'in' ]  = placing;
    parameter.required = true;
    if ( parameter[ 'in' ] !== ParameterPlacings.PATH ) {
      if ( param.flags && param.flags.filter( flag => flag === "Optional" ).length > 0 ) {
        parameter.required = false;
      }
    }
    let defaultValue: any;
    if ( decorator.arguments && decorator.arguments.value ) {
      let value: any = helper.evalArgument( decorator.arguments.value );
      if ( value ) {
        if ( typeof(value) === 'object' ) {
          if ( value.value !== undefined && value.value !== null ) {
            defaultValue = value.value;
          }
          if ( value.format !== undefined && value.format !== null ) {
            parameter.collectionFormat = value.format;
          }
        } else {
          defaultValue = value;
        }
      }
    }

    if ( param.comment && param.comment.text && param.comment.text.trim() ) {
      parameter.description = param.comment.text.trim();
    }

    let schema = modelCollector.collectByType( param.type.toString() );
    if ( schema ) {
      if ( placing !== ParameterPlacings.BODY ) {
        if ( defaultValue != null ) {
          parameter[ 'default' ] = defaultValue;
        }
        parameter.type = schema.type;
      } else {
        if ( defaultValue != null ) {
          schema[ 'default' ] = defaultValue;
        }
        parameter.schema = schema;
      }
    }

    return parameter;
  }

  private typeToString( type: Type ): string {
    if ( type instanceof ReferenceType ) {
        let referenceType:ReferenceType = <ReferenceType>type;
        if(referenceType.typeArguments && referenceType.typeArguments.length > 0){
          if(this.parseTypeName(type.name)){
            let types:string[] = referenceType.typeArguments.map(typeArg => this.typeToString(typeArg));
            return type.name + '<' + types.join(',') + '>';
          }else{
            return this.typeToString(referenceType.typeArguments[0]);
          }
        }else{
          return this.parseTypeName(type.name) || 'any';
        }
    } else {
      return this.parseTypeName(type.toString()) || 'any';
    }
  }

  private parseTypeName(name:string):string{
    const names = ['Observable'];
    if(names.indexOf(name) === -1){
      return name;
    }
    return null;
  }
}