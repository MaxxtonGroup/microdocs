import { Schema, SchemaTypes } from '@maxxton/microdocs-core/domain';
import { PropertyBuilder, ModelBuilder } from '@maxxton/microdocs-core/builder';
import { SchemaHelper } from '@maxxton/microdocs-core/helpers';
import { ContainerReflection, Reflection, ReflectionKind, ReflectionFlag } from "@maxxton/typedoc/dist/lib/models";
import { AbstractCrawler } from "./abstract/abstract.crawler";
import { ModelCrawler } from "./abstract/model.crawler";
import { PropertyCrawler } from "./abstract/property.crawler";
import * as helper from './helpers/crawler.helper';
import { DeclarationReflection } from "@maxxton/typedoc/dist/lib/models/reflections/declaration";

/**
 * Collects Models
 */
export class ModelCollector {

  private collectQueue:string[]                      = [];
  private collectedSchemas:{[name:string]:Schema}    = {};
  private modelCrawlers:ModelCrawler[]               = [];
  private propertyCrawlers:PropertyCrawler[]         = [];
  private genericCollectQueue:GenericTypeCollector[] = [];

  public addModelCrawler( modelCrawler:ModelCrawler ):void {
    this.modelCrawlers.push( modelCrawler );
  }

  public addPropertyCrawler( propertyCrawler:PropertyCrawler ):void {
    this.propertyCrawlers.push( propertyCrawler );
  }

  /**
   * Get list of model names which are already used models
   * @returns {string[]} list of model names
   */
  public getModelCollectQueue():string[] {
    return this.collectQueue;
  }

  /**
   * Add a model name to the collectQueue and return a reference
   * @param modelName name of the model
   * @param genericTypes
   * @returns {{$ref: string}} Reference object
   */
  public collectByName( modelName:string, genericTypes:Schema[] = [] ):Schema {
    if ( genericTypes.length == 0 ) {
      if ( this.collectQueue.indexOf( modelName ) == -1 && !this.collectedSchemas[ modelName ] ) {
        this.collectQueue.push( modelName );
      }
      return {
        $ref: this.getReference( modelName )
      };
    } else {
      var schema               = {};
      var genericTypeCollector = new GenericTypeCollector( modelName, genericTypes, schema );
      this.genericCollectQueue.push( genericTypeCollector );
      return schema;
    }
  }

  /**
   * Resolve and collect a type string, eg: {person: Person, gender: string}
   * @param typeString type string
   * @returns {Schema} resolved schema, with addition references to objects
   */
  public collectByType( typeString:string ):Schema {
    try {
      return SchemaHelper.resolveTypeString( typeString, ( modelName, genericTypes ) => this.collectByName( modelName, genericTypes ) );
    } catch ( e ) {
      console.warn( e );
      return { type: SchemaTypes.ANY };
    }
  }

  private triggerCrawlers( crawlers:AbstractCrawler[], call:( crawler:AbstractCrawler ) => void ) {
    crawlers.sort( ( a, b ) => a.order - b.order ).forEach( crawler => call( crawler ) );
  }

  public collectClasses( classReflections:ContainerReflection[] ):{[name:string]:Schema} {
    while ( this.collectQueue.length > 0 || this.genericCollectQueue.length > 0 ) {
      if ( this.collectQueue.length > 0 ) {
        // Non generic types first
        let className    = this.collectQueue.shift();
        let filterResult = classReflections.filter( classReflection => classReflection.name === className );
        if ( filterResult.length == 0 ) {
          // not found, return empty object
          console.warn( "Could not find model '" + className + "'" );
          let schema:Schema                  = {
            name: className,
            type: SchemaTypes.OBJECT
          };
          this.collectedSchemas[ className ] = schema;
        } else {
          //found, start resolving
          let schema                         = this.collect( filterResult[ 0 ] );
          this.collectedSchemas[ className ] = schema;
        }
      } else {
        // Then generic types
        let generic      = this.genericCollectQueue.shift();
        let filterResult = classReflections.filter( classReflection => classReflection.name === generic.modelName );
        if ( filterResult.length == 0 ) {
          // not found, return empty object
          console.warn( "Could not find model '" + generic.modelName + "'" );
          let schema:Schema                          = {
            name: generic.modelName,
            type: SchemaTypes.OBJECT
          };
        } else {
          //found, start resolving
          let schema = this.collect( filterResult[ 0 ], generic.genericTypes );
          for ( let key in schema ) {
            generic.schema[ key ] = schema[ key ];
          }
        }
      }
    }

    return this.collectedSchemas;
  }

  /**
   * Collect model by it's class reference
   * @param classReflection
   */
  private collect( reflection:Reflection, genericTypes:Schema[] = [] ):Schema {
    if ( reflection.kind == ReflectionKind.Class || reflection.kind == ReflectionKind.Interface ) {
      let classReflection:DeclarationReflection = <DeclarationReflection> reflection;
      if ( this.collectedSchemas[ classReflection.name ] ) {
        return {
          $ref: this.getReference( classReflection.name )
        };
      }

      let modelBuilder = new ModelBuilder( classReflection.name );
      this.triggerCrawlers( this.modelCrawlers, crawler => crawler.crawl( modelBuilder, classReflection ) );

      let classSchema:Schema = modelBuilder.build();

      let typeParams:{[key:string]:Schema} = {};
      if ( classReflection.typeParameters ) {
        for ( let i = 0; i < classReflection.typeParameters.length; i++ ) {
          if ( i < genericTypes.length ) {
            typeParams[ classReflection.typeParameters[ i ].name ] = genericTypes[ i ];
          }
        }
      }

      classReflection.children.filter( child => child.kind == ReflectionKind.Property ).forEach( property => {
        let propertyBuilder           = new PropertyBuilder();
        propertyBuilder.property.type = property.type.toString();
        propertyBuilder.property.name = property.name;
        if ( property.defaultValue ) {
          propertyBuilder.property.defaultValue = property.defaultValue;
        }
        propertyBuilder.property.required = !(property.flags && property.flags.filter( flag => flag === 'Optional' ).length > 0);

        this.triggerCrawlers( this.propertyCrawlers, ( crawler:AbstractCrawler ) => crawler.crawl( propertyBuilder, classReflection, property ) );

        var propResult = propertyBuilder.build();
        let schema:Schema     = null;
        if ( typeParams[ propResult.type.toString().trim() ] ) {
          schema = typeParams[ propResult.type.toString().trim() ];
        } else {
          schema = this.collectByType( propResult.type.toString() );
        }
        schema.required = propResult.required;
        if ( propResult.defaultValue ) {
          schema.default = helper.evalArgument( propResult.defaultValue );
        }

        classSchema.properties[ propResult.name ] = schema;
      } );
      return classSchema;
    }
    return null;
  }

  private getReference( name:string ):string {
    return "#/definitions/" + name;
  }

}

class GenericTypeCollector {

  constructor( public modelName:string, public genericTypes:Schema[], public schema:Schema ) {
  }

}