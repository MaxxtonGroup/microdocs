import {Annotation} from "./annotation.model";
import {Method} from "./method.model";

export interface Component{

    name?:string;
    type?:d;
    description?:string;
    authors?:string[];
    annotations?:{[name:string]:Annotation[]};
    methods?:{[name:string]:Method[]};
    dependencies?:Component[];

}