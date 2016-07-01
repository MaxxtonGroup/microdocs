import {Schema} from "./schema.model";

export interface SchemaObject extends Schema{
    properties:{[key:string]:Schema};
    allOf?:Array<Schema>;
    name?:string;
    simpleName?:string;
    genericName?:string;
    genericSimpleName?:string;
}