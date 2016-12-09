
import {ProjectTree} from "./project-tree.model";

export abstract class Node{

  /**
   * Get the root of the Tree
   * @return {ProjectTree}
   */
  public abstract getRoot():ProjectTree;

  /**
   * Get the parent of this Node
   * @return {Node}
   */
  public abstract getParent():Node;

  /**
   * Get the reference from the root of the tree to this node
   * @return {string}
   */
  public abstract getReference():string;
  
  public abstract findNodePath(title:string, version:string):string;
  
  public abstract unlink():{};

  public abstract resolveReference(reference:string):Node;
}