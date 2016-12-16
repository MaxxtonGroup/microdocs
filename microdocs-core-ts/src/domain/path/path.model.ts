import {Component} from "../component/component.model";
import {Method} from "../component/method.model";
import {Parameter} from "./parameter.model";
import {ResponseModel} from "./response.model";
import { Problemable } from "../problem/problemable.model";

export interface Path extends Problemable {
  path?:string;
  requestMethod?:string;
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