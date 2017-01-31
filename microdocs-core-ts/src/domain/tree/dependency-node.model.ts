
import {ProjectNode} from "./project-node.model";
import {Node} from './node.model';
import { ProjectTree } from "./project-tree.model";

export class DependencyNode extends Node{

  constructor(public item?:ProjectNode, public type?:string, public problems:number = 0) {
    super();
  }

  getRoot():ProjectTree {
    return this.item.getRoot();
  }

  public getParent():Node{
    return this.item.parent;
  }

  /**
   * Get the reference from the root of the tree to this node
   * @return {string}
   */
  public getReference():string{
    let ref = this.item.getReference();
    return ref.substring(0, ref.length - 5);
  }

  findNodePath( title:string, version:string ):string {
    return this.item.getRoot().findNodePath(title, version);
  }

  unlink():{} {
    return this.item.unlink();
  }

  public toJson():string{
    return JSON.stringify(this.unlink());
  }

  public resolveReference( reference:string ):Node {
    if(reference.indexOf('#/') == 0){
      return this.getRoot().resolveReference(reference);
    }
    if(reference.indexOf('item/') == 0) {
      reference = reference.substr( 'item/'.length );
      return this.item.resolveReference(reference);
    }
    return null;
  }
  
  public static link(unlinkedDependency:any, title:string):DependencyNode{
    var dependency = new DependencyNode();
    if(unlinkedDependency.item){
      let unlinkedProject = unlinkedDependency.item;
      let project = ProjectNode.link(unlinkedProject, title);
      dependency.item = project;
    }
    if (unlinkedDependency.type) {
      dependency.type = unlinkedDependency.type;
    }
    if (unlinkedDependency.problems) {
      dependency.problems = unlinkedDependency.problems;
    }
    
    return dependency;
  }
  
}