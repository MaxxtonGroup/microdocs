import { Schema } from "../schema/schema.model";

/**
 * @author Steven Hermans
 */
export interface Parameter {

  name?: string;
  in?: string;
  description?: string;
  required?: boolean;
  schema?: Schema;
  allowEmptyValue?: boolean;

  //all
  type?: string;
  default?: any;
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

  //array
  items?: Schema;
  collectionFormat?: string;

  //enum
  enum?: any[];


}