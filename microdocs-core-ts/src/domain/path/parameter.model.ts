import {Schema} from "../schema/schema.model";
import {SchemaType} from "../schema/schema-type.model";
import {ParameterPlacing} from "./parameter-placing.model";

/**
 * @author Steven Hermans
 */
export interface Parameter {

    name?:string;
    in?:ParameterPlacing;
    description?:string;
    required?:boolean;
    schema?:Schema;
    allowEmptyValue?:boolean;

    //all
    type:SchemaType;
    default?:any;
    multipleOf?:number;
    maximum?:number;
    minimum?:number;
    exclusiveMaximum?:number;
    inclusiveMinimum?:number;
    maxLength?:number;
    minLength?:number;
    pattern?:string;
    maxItems?:number;
    minItems?:number;
    uniqueItems?:number;
    maxProperties?:number;
    minProperties?:number;

    //array
    items?:Schema;
    collectionFormat?:string;


}