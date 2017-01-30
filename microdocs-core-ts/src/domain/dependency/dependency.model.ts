import { Path } from "../path/path.model";
import { Component } from "../component/component.model";
import { DependencyImport } from "./dependency-import.model";
import { Problemable } from "../problem/problemable.model";

/**
 * @author Steven Hermans
 */
export interface Dependency extends Problemable{

  dependencyName?:string;
  description?:string;
  group?:string;
  version?:string;
  latestVersion?:string;
  deprecatedVersions?:string[];
  type:string;
  protocol?:string;
  import?:DependencyImport;
  paths?:{[path:string]:{[method:string]:Path}};
  component?:Component;
  inherit?:boolean;

}