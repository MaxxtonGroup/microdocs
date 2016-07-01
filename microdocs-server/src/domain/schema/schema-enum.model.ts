import {Schema} from "./schema.model";

export interface SchemaEnum extends Schema{
    enum:Array<any>;
    name?:string;
    simpleName?:string;
}