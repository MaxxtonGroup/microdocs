import {RequestMethod} from "./request-method.model";
import {Component} from "../component/component.model";
import {Parameter} from "./parameter.model";
import {ResponseModel} from "./response.model";

export interface Path {
    path?:string;
    method?:RequestMethod;
    controller?:Component;
    tags?:Array<string>;
    summary?:string;
    description?:string;
    operationId?:string;
    consumes?:Array<string>;
    produces?:Array<string>;
    parameters?:Array<Parameter>;
    responses?:{[key:string]:ResponseModel};
    deprecated?:boolean;
    security?:{};//todo: security
}