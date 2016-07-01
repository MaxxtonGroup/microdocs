import {SchemaType} from "./schema-type.model";
export interface Schema{
    type:SchemaType;
    default?:any;
    description?:string;
    required?:boolean;
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
}