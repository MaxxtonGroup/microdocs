
import {ProjectNode} from "./project-node.model";

export class ProjectNodeDependency{
  
  constructor(public title:string, public item:ProjectNode, public type:string, public problems:number = 0) {
  }
  
}