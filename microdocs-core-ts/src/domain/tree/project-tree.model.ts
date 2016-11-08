
import {Node} from "./node.model";
import {ProjectNode} from "./project-node.model";

export class ProjectTree extends Node{
  
  public projects:ProjectNode[] = [];

  public addProject(projectNode:ProjectNode):void{
    var removeList = this.projects.filter(node => node.title === projectNode.title);
    removeList.forEach(node => this.removeProject(node));
    this.projects.push(projectNode);
    projectNode.parent = this;
  }

  public removeProject(projectNode:ProjectNode):void{
    let index = this.projects.indexOf(projectNode);
    if(index > -1){
      this.projects.splice(index, 1);
    }
    projectNode.parent = null;
  }
  
  public getRoot():ProjectTree {
    return this;
  }

  public resolveReference( reference:string ):Node {
    if(reference.indexOf('#/') == 0){
      reference = reference.substr(2);
    }
    var match = reference.match(/^(.*?)\/(.+)$/);
    if(match && match.length >= 2){
      var title = match[1];
      var results = this.projects.filter(projectNode => projectNode.title == title);
      if(results.length > 0){
        if(match.length > 2){
          return results[0].resolveReference(reference);
        }else{
          return results[0];
        }
      }
    }else{
      var results = this.projects.filter(projectNode => projectNode.title === reference);
      if(results.length > 0){
        return results[0];
      }
    }
    return null;
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