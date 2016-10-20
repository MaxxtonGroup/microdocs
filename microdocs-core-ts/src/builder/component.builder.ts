import {Component} from "../domain/component/component.model";
import {Builder} from "./builder";

/**
 * @author Steven Hermans
 */
export class ComponentBuilder implements Builder<Component>{
  
  private _component:Component = {};
  public title:string;
  
  public component():Component {
    return this._component;
  }
  
  build():Component {
    return this._component;
  }
  
}