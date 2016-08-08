import {Component} from "./component.model";
import {Annotation} from "./annotation.model";

/**
 * @author Steven Hermans
 */
export interface Method{

    name?:string;
    description?:string;
    paramters?:string[];
    lineNumber?:number;
    component?:Component;
    annotations?:{[name:string]:Annotation};

}