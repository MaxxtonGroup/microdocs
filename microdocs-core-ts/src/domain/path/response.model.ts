import {Schema} from "../schema/schema.model";

/**
 * @author Steven Hermans
 */
export interface ResponseModel{

    description?:string;
    schema?:Schema;
    headers?:{[name:string]:Schema};
    examples?:{[name:string]:string};

}