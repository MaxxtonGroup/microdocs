
import {Node} from "./node.model";
import {ProjectNode} from "./project-node.model";
import { FlatList } from "./flat-list.model";
import { DependencyNode } from "./dependency-node.model";

export class ProjectTree extends Node{
  
  private _projects:ProjectNode[] = [];

  get projects():ProjectNode[] {
    return this._projects;
  }

  /**
   * Add new ProjectNode, overwrite existing one
   * @param projectNode {ProjectNode}
   */
  public addProject(projectNode:ProjectNode):void{
    var removeList = this._projects.filter(node => node.title === projectNode.title);
    removeList.forEach(node => this.removeProject(node));
    this._projects.push(projectNode);
    projectNode.parent = this;
  }

  /**
   * Remove project from the root tree, remove references to that project and rearrange siblings of the ProjectNode
   * @param projectNode {ProjectNode}
   */
  public removeProject(projectNode:ProjectNode):void{
    let index = this._projects.indexOf(projectNode);
    if(index > -1){
      // remove references to the projectNode
      let reverseDependencies:DependencyNode[] = this.findReverseDependencies('#/' + projectNode.title);
      reverseDependencies.forEach(dependencyNode => {
        let parent = <ProjectNode>dependencyNode.getParent();
        parent.removeDependency(dependencyNode);
      });

      // remove projectNode
      this._projects.splice(index, 1);

      // rearrange siblings
      if(projectNode.dependencies){
        while(this.rearrangeNodes(this, projectNode.dependencies));
      }

    }
    projectNode.parent = null;
  }

  private rearrangeNodes(projectTree:ProjectTree, dependencyNodes:DependencyNode[]):boolean{
    return dependencyNodes.some((dependencyNode:DependencyNode) => {
      let reference = dependencyNode.getReference() + '/item';
      let reverseDependencyNodes = this.findReverseDependencies(reference);
      if(reverseDependencyNodes.length > 0){
        // Move dependency item to new place
        let firstDep = reverseDependencyNodes[0];
        let depTitle = firstDep.item.title;
        firstDep.item = dependencyNode.item;
        firstDep.item.title = depTitle;
        if(reverseDependencyNodes.length > 1){
          // redirect other dependencies to the new place
          let newReference = firstDep.item.getReference();
          reverseDependencyNodes.some((reverseDependencyNode:DependencyNode) => {
            reverseDependencyNode.item.reference = newReference;
            return false;
          });
        }
        return true;
      }else if(dependencyNode.item && dependencyNode.item.dependencies){
        this.rearrangeNodes(projectTree, dependencyNode.item.dependencies);
      }
      return false;
    });
  }

  /**
   * Remove project from the root tree, remove references to that project and reorganise siblings of the ProjectNode
   * @param title {string} name of the project node
   */
  public removeProjectByName(title:string){
    let projectNode = this.getProject(title);
    if(projectNode){
      this.removeProject(projectNode);
    }
  }

  /**
   * Get a project by name
   * @param title {string} name of the project node
   * @return {ProjectNode}
   */
  public getProject(title:string):ProjectNode{
    return this._projects.filter(node => node.title === title)[0]
  }

  /**
   * Get the root of the Tree
   * @return {ProjectTree}
   */
  public getRoot():ProjectTree {
    return this;
  }

  /**
   * Get the parent of this Node
   * @return {Node}
   */
  public getParent():Node{
    return null;
  }

  /**
   * Get the reference from the root of the tree to this node
   * @return {string}
   */
  public getReference():string{
    return '#';
  }

  /**
   * Find dependencies that uses the given reference
   * @param reference {string} eg. '#/example-project/dependencies/item/child-project'
   * @return {DepencencyNode[]}
   */
  public findReverseDependencies(reference:string):DependencyNode[]{
    let dependencyNodes:DependencyNode[] = [];
    this._projects.forEach(projectNode => {
      dependencyNodes = projectNode.findReverseDependencies(reference).concat(dependencyNodes);
    });
    return dependencyNodes;
  }

  /**
   * Find a node by a reference, eg. '#/example-project/dependencies/item/child-project'
   * @param reference {string} reference for a node
   * @return {Node} null if no node is found
   */
  public resolveReference( reference:string ):Node {
    if(reference.indexOf('#/') == 0){
      reference = reference.substr(2);
    }
    var match = reference.match(/^(.*?)\/(.+)$/);
    if(match && match.length >= 2){
      var title = match[1];
      var results = this._projects.filter(projectNode => projectNode.title == title);
      if(results.length > 0){
        if(match.length > 2){
          return results[0].resolveReference(reference);
        }else{
          return results[0];
        }
      }
    }else{
      var results = this._projects.filter(projectNode => projectNode.title === reference);
      if(results.length > 0){
        return results[0];
      }
    }
    return null;
  }

  /**
   * Find a reference for ProjectNode which match the title and version
   * @param title {string} title of the node
   * @param version {string} version of the node
   * @return {string} reference string, eg. '#/example-project/dependencies/item/child-project'
   */
  public findNodePath(title:string, version:string):string {
    for(var i = 0; i < this._projects.length; i++){
      var project = this._projects[i];
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
    this._projects.forEach(project => {
      dependencies[project.title] = project.unlink();
    });
    return dependencies;
  }

  public toJson():string{
    return JSON.stringify(this.unlink());
  }
  
  public static link(unlinkedRoot:any):ProjectTree{
    var root = new ProjectTree();
    if(unlinkedRoot) {
      for (let key in unlinkedRoot) {
        let unlinkedProject = unlinkedRoot[key];
        let projectNode = ProjectNode.link(unlinkedProject, key);
        projectNode.parent = root;
        root._projects.push(projectNode);
      }
    }
    return root;
  }

  public toFlatList():FlatList{
    let flatList = new FlatList();
    let includeProjects:string[] = [];
    this._projects.forEach(projectNode => {
      projectNode.toFlatList(false, flatList, includeProjects);
    });
    return <FlatList>flatList.filter(projectNode => includeProjects.filter(includeProject => projectNode.title === includeProject).length == 0);
  }
}