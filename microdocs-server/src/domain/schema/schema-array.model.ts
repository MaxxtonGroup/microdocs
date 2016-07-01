import {Schema} from "./schema.model";

export interface SchemaArray extends Schema{
    items:Schema;
}