import {Schema} from "./schema.model";

export interface SchemaPrimitive extends Schema{
    format?:string;
}