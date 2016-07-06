
import {Path} from "../path/path.model";
import {Component} from "../component/component.model";
import {DependencyImport} from "./dependency-import.model";
import {DependencyType} from "./dependency-type.model";

/**
 * @author Steven Hermans
 */
export interface Dependency {

    description?:string;
    group?:string;
    version?:string;
    latestVersion?:string;
    type:DependencyType;
    protocol?:string;
    import?:DependencyImport;
    paths?:{[path:string]:{[method:string]:Path}};
    component?:Component;

}