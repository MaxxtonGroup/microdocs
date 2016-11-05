
import {ProjectTree} from "./project-tree.model";

export abstract class Node{
  
  public abstract getRoot():ProjectTree;
  
  public abstract findNodePath(title:string, version:string):string;
  
  public abstract unlink():{};

  public abstract resolveReference(reference:string):Node;
}