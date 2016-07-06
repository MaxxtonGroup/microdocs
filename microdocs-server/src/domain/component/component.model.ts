import {Annotation} from "./annotation.model";
import {Method} from "./method.model";
import {ComponentType} from "./component-type.model";

export interface Component{

    name?:string;
    type?:ComponentType;
    description?:string;
    authors?:string[];
    annotations?:{[name:string]:Annotation[]};
    methods?:{[name:string]:Method[]};
    dependencies?:Component[];

}