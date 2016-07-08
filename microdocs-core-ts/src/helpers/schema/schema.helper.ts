
import {Schema} from "../../domain/schema/schema.model";

/**
 * Generate fake data using Faker.js
 */
export class SchemaHelper{

  /**
   * Resolve schema and return an example object
   * @param schema
   * @param fieldName
   * @return example object
   */
  public static resolve(schema:Schema, schemaList:{[key:string]:Schema}, fieldName?:string):any{
    console.info(schema);
    console.info(schemaList);
    if(schema != undefined && schema != null){
      if(schema.$ref != undefined && schema.$ref.indexOf("#/definitions/" == 0)){
        var schemaName = schema.$ref.substring("#/definitions/".length);
        var refObject = schemaList[schemaName];
        if(refObject != undefined){
          return SchemaHelper.resolve(refObject, schemaList, fieldName);
        }
      }
      if(schema.type == 'enum'){
        var random = Math.floor((Math.random() * schema.enum.length));
        return schema.enum[random];
      }else if(schema.type == 'boolean'){
        var random = Math.floor((Math.random() * 2));
        return random == 1;
      }else if(schema.type == 'integer'){
        var random = Math.floor((Math.random() * 99) +1);
        return random;
      }else if(schema.type == 'number'){
        var random = (Math.random() * 99) +1;
        return random;
      }else if(schema.type == 'string'){
        return "Extended kindness trifling";
      }else if(schema.type == 'array'){
        var random = Math.floor((Math.random() * 5));
        var array : Array<any> = [];
        for(var i = 0; i < random; i++){
          array.push(SchemaHelper.resolve(schema.items, schemaList));
        }
        return array;
      }else if(schema.type == 'object'){
        var object:{} = {};
        if(schema.allOf != undefined){
          schema.allOf.forEach(superSchema => {
            if(superSchema.type == 'object') {
              var superObject = SchemaHelper.resolve(superSchema, schemaList, fieldName);
              for (var field in superSchema) {
                object[field] = superSchema[field];
              }
            }
          });
          return schema;
        }
        for(var field in schema.properties){
          object[field] = SchemaHelper.resolve(schema.properties[field], schemaList, field);
        }
        return object;
      }
    }
    return null;
  }

}