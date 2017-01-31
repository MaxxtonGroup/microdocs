import {SchemaMappings} from "./schema-mappings.model";
export interface Schema {

  //all
  type?: string;
  default?: any;
  description?: string;
  required?: boolean;
  multipleOf?: number;
  maximum?: number;
  minimum?: number;
  exclusiveMaximum?: number;
  inclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: number;
  maxProperties?: number;
  minProperties?: number;
  mappings?:SchemaMappings;

  //array
  items?: Schema;
  collectionFormat?: string;

  //object
  properties?: {[name: string]: Schema};
  additonalProperties?: Schema;
  allOf?: Schema[];
  name?: string;
  simpleName?: string;
  genericName?: string;
  genericSimpleName?: string;

  //enum
  enum?: any[];

  //reference
  $ref?: string;

  [key:string]:any;

}