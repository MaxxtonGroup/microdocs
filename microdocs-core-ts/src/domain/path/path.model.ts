import {RequestMethod} from "./request-method.model";
import {Component} from "../component/component.model";
import {Method} from "../component/method.model";
import {Parameter} from "./parameter.model";
import {ResponseModel} from "./response.model";

export interface Path {
    path?:string;
    requestMethod?:RequestMethod;
    controller?:Component;
    method?:Method;
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