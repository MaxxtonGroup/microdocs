import {Annotation} from "./annotation.model";
import {Method} from "./method.model";
import {Problem} from "../problem/problem.model";

export interface Component{

    name?:string;
    file?:string;
    type?:string;
    description?:string;
    authors?:string[];
    annotations?:{[name:string]:Annotation};
    methods?:{[name:string]:Method};
    dependencies?:Component[];
    problems?:Array<Problem>;

}