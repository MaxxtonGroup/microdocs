import {Component} from "./component.model";
import {Annotation} from "./annotation.model";

/**
 * @author Steven Hermans
 */
export interface Method{

    name?:string;
    description?:string;
    parameters?:string[];
    lineNumber?:number;
    component?:Component;
    annotations?:{[name:string]:Annotation};
    $ref?: string;

}