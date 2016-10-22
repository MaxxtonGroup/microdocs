
import {Node} from "./node.model";
import {ProjectNode} from "./project-node.model";

export class RootNode extends Node{
  
  public projects:ProjectNode[] = [];
  
  public getRoot():RootNode {
    return this;
  }
  
  public findNodePath(title:string, version:string):string {
    for(var i = 0; i < this.projects.length; i++){
      var project = this.projects[i];
      if (project.title === title && project.version == version) {
        return "/" + title;
      }
      var path = project.findNodePath(title, version);
      if (path) {
        return "/" + title + path;
      }
    }
    return null;
  }
  
  public unlink():{}{
    var dependencies:{[title:string]:{}} = {};
    this.projects.forEach(project => {
      dependencies[project.title] = project.unlink();
    });
    return dependencies;
  }
  
  public static link(unlinkedRoot:{}):RootNode{
    var root = new RootNode();
    if(unlinkedRoot) {
      for (let key in unlinkedRoot) {
        let unlinkedProject = unlinkedRoot[key];
        let projectNode = ProjectNode.link(unlinkedProject, key);
        projectNode.parent = root;
        root.projects.push(projectNode);
      }
    }
    return root;
  }
}