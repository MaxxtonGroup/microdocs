
import {ProjectNode} from "./project-node.model";

export class DependencyNode{
  
  constructor(public item?:ProjectNode, public type?:string, public problems:number = 0) {
  }
  
  public static link(unlinkedDependency:{}, title:string):DependencyNode{
    var dependency = new DependencyNode();
    if(unlinkedDependency['item']){
      let unlinkedProject = unlinkedDependency['item'];
      let project = ProjectNode.link(unlinkedProject, title);
      dependency.item = project;
    }
    if (unlinkedDependency['type']) {
      dependency.type = unlinkedDependency['type'];
    }
    if (unlinkedDependency['problems']) {
      dependency.problems = unlinkedDependency['problems'];
    }
    
    return dependency;
  }
  
}