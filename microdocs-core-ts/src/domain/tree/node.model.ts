
import {RootNode} from "./root-node.model";

export abstract class Node{
  
  public abstract getRoot():RootNode;
  
  public abstract findNodePath(title:string, version:string):string;
  
  public abstract unlink():{};
}