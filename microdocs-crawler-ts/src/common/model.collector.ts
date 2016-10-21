
import {Schema, SchemaTypes} from 'microdocs-core-ts/dist/domain';
import {PropertyBuilder, ModelBuilder} from 'microdocs-core-ts/dist/builder';
import {SchemaHelper} from 'microdocs-core-ts/dist/helpers';
import {ContainerReflection, Reflection, ReflectionKind, ReflectionFlag} from "typedoc/lib/models";
import {AbstractCrawler} from "./abstract/abstract.crawler";
import {ModelCrawler} from "./abstract/model.crawler";
import {PropertyCrawler} from "./abstract/property.crawler";
import * as helper from './helpers/crawler.helper';

/**
 * Collects Models
 */
export class ModelCollector{

  private collectQueue:string[] = [];
  private collectedSchemas:{[name:string]:Schema} = {};
  private modelCrawlers:ModelCrawler[] = [];
  private propertyCrawlers:PropertyCrawler[] = [];

  public addModelCrawler(modelCrawler:ModelCrawler):void{
    this.modelCrawlers.push(modelCrawler);
  }

  public addPropertyCrawler(propertyCrawler:PropertyCrawler):void{
    this.propertyCrawlers.push(propertyCrawler);
  }

  /**
   * Get list of model names which are already used models
   * @returns {string[]} list of model names
   */
  public getModelCollectQueue():string[]{
    return this.collectQueue;
  }

  /**
   * Add a model name to the collectQueue and return a reference
   * @param modelName name of the model
   * @returns {{$ref: string}} Reference object
   */
  public collectByName(modelName:string):Schema{
    if(this.collectQueue.indexOf(modelName) == -1 && !this.collectedSchemas[modelName]) {
      this.collectQueue.push(modelName);
    }
    return {
      $ref: this.getReference(modelName)
    };
  }

  /**
   * Resolve and collect a type string, eg: {person: Person, gender: string}
   * @param typeString type string
   * @returns {Schema} resolved schema, with addition references to objects
   */
  public collectByType(typeString:string):Schema{
    try {
      return SchemaHelper.resolveTypeString(typeString, modelName => this.collectByName(modelName));
    }catch(e){
      console.warn(e);
      return {type:SchemaTypes.ANY};
    }
  }

  private triggerCrawlers(crawlers: AbstractCrawler[], call: (AbstractCrawler) => void) {
    crawlers.sort((a, b) => a.order - b.order).forEach(crawler => call(crawler));
  }

  public collectClasses(classReflections:ContainerReflection[]):{[name:string]:Schema}{
    while(this.collectQueue.length > 0){
      let className = this.collectQueue.shift();
      var filterResult = classReflections.filter(classReflection => classReflection.name === className);
      if(filterResult.length == 0){
        // not found, return empty object
        console.warn("Could not find model '" + className + "'");
        let schema:Schema = {
          name: className,
          type: SchemaTypes.OBJECT
        };
        this.collectedSchemas[className] = schema;
      }else{
        //found, start resolving
        let schema = this.collect(filterResult[0]);
        this.collectedSchemas[className] = schema;
      }
    }

    return this.collectedSchemas;
  }

  /**
   * Collect model by it's class reference
   * @param classReflection
   */
  private collect(reflection: Reflection):Schema{
    if(reflection.kind == ReflectionKind.Class || reflection.kind == ReflectionKind.Interface){
      let classReflection:ContainerReflection = <ContainerReflection> reflection;
      if(this.collectedSchemas[classReflection.name]){
        return {
          $ref: this.getReference(classReflection.name)
        };
      }

      let modelBuilder = new ModelBuilder(classReflection.name);
      this.triggerCrawlers(this.modelCrawlers, crawler => crawler.crawl(modelBuilder, classReflection));

      let classSchema:Schema = modelBuilder.build();
      classReflection.children.filter(child => child.kind == ReflectionKind.Property).forEach(property => {
        let propertyBuilder = new PropertyBuilder();
        propertyBuilder.property.type = property.type.toString();
        propertyBuilder.property.name = property.name;
        if(property.defaultValue){
          propertyBuilder.property.defaultValue = property.defaultValue;
        }
        propertyBuilder.property.required = !(property.flags && property.flags.filter(flag => flag === 'Optional').length > 0);

        this.triggerCrawlers(this.propertyCrawlers, (crawler) => crawler.crawl(propertyBuilder, classReflection, property));

        var propResult = propertyBuilder.build();
        let schema = this.collectByType(propResult.type.toString());
        schema.required = propResult.required;
        if(propResult.defaultValue){
          schema.default = helper.evalArgument(propResult.defaultValue);
        }

        classSchema.properties[propResult.name] = schema;
      });
      return classSchema;
    }
    return null;
  }

  private getReference(name:string):string{
    return "#/definitions/" + name;
  }

}