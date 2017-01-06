import {Annotation} from "./annotation.model";
import {Method} from "./method.model";
import { Problemable } from "../problem/problemable.model";

/**
 * @model
 */
export interface Component extends Problemable{

    name?:string;
    file?:string;
    type?:string;
    description?:string;
    authors?:string[];
    annotations?:{[name:string]:Annotation};
    methods?:{[name:string]:Method};
    dependencies?:Component[];

}