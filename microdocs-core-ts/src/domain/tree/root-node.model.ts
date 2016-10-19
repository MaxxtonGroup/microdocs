
import {Node} from "./node.model";
import {ProjectNode} from "./project-node.model";

export class RootNode extends Node{
  
  public projects:{[key:string]:ProjectNode} = {};
  
  public getRoot():RootNode {
    return this;
  }
  
  public findNodePath(title:string, version:string):string {
    for(var key in this.projects){
      var project = this.projects[key];
      if (key === title && project.version == version) {
        return "/dependencies/" + title;
      }
      var path = project.findNodePath(title, version);
      if (path != null) {
        return "/dependencies/" + title + '/item' + path;
      }
    }
    return null;
  }
  
  public unlink():{}{
    var dependencies:{[title:string]:{}} = {};
    for (var key in this.projects) {
      var child = this.projects[key];
      dependencies[key] = child.unlink();
    }
    return dependencies;
  }
}