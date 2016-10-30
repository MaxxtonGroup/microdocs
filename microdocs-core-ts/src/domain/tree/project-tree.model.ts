
import {Node} from "./node.model";
import {ProjectNode} from "./project-node.model";

export class ProjectTree extends Node{
  
  public projects:ProjectNode[] = [];

  public addProject(projectNode:ProjectNode):void{
    var removeList = this.projects.filter(node => node.title === projectNode.title);
    removeList.forEach(node => delete this.projects[this.projects.indexOf(node)]);
    this.projects.push(projectNode);
  }
  
  public getRoot():ProjectTree {
    return this;
  }
  
  public findNodePath(title:string, version:string):string {
    for(var i = 0; i < this.projects.length; i++){
      var project = this.projects[i];
      if (project.title === title && project.version === version) {
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
  
  public static link(unlinkedRoot:{}):ProjectTree{
    var root = new ProjectTree();
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