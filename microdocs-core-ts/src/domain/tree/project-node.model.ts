
import {Node} from "./node.model";
import {RootNode} from "./root-node.model";
import {ProjectNodeDependency} from "./project-node-dependency.model";
import {Project} from "gulp-typescript/release/project";

export class ProjectNode extends Node{

  constructor(public parent:Node = null,
              public dependencies:ProjectNodeDependency[] = [],
              public group?:string,
              public version?:string,
              public versions?:string[],
              public problems?:number,
              public reference?:string,
              public tags?:string[]) {
  }

  public getRoot():RootNode {
    return this.parent.getRoot();
  }

  public findNodePath(title:string, version:string):string {
    for(var i = 0; i < this.dependencies.length; i++){
      var dependency = this.dependencies[i];
      if (dependency.title === title && dependency.item.version == version) {
        return "/dependencies/" + title;
      }
      var path = dependency.item.findNodePath(title, version);
      if (path != null) {
        return "/dependencies/" + title + '/item' + path;
      }
    }
    return null;
  }

  public unlink():{} {
    if (this.reference) {
      return {
        '$ref': "#" + this.reference.substring("#/dependencies".length)
      };
    }
    
    var dependencies:{[title:string]:{}} = {};
    this.dependencies.forEach(dependency => {
      var child = {
        item: dependency.item
      };
      if(dependency.problems){
        child['problems'] = dependency.problems;
      }
      if(dependency.type){
        child['type'] = dependency.type;
      }
      dependencies[dependency.title] = child;
    });
    
    var node = {};
    if (Object.keys(dependencies).length > 0) {
      node['dependencies'] = dependencies;
    }
    if (this.group != null || this.group != undefined) {
      node['group'] = this.group;
    }
    if (this.version != null || this.version != undefined) {
      node['version'] = this.version;
    }
    if (this.versions != null || this.versions != undefined) {
      node['versions'] = this.versions;
    }
    if (this.problems != null || this.problems != undefined) {
      node['problems'] = this.problems;
    }
    if (this.tags != null || this.tags != undefined) {
      node['tags'] = this.tags;
    }
    return node;
  }
  
  public static linkProject(unlinkedProject:{}):ProjectNode{
    
  }
  
  public static linkDependency(unlinkedDependency:{}):ProjectNodeDependency{
    
  }

  public static link(unlinkedNode:{}, root:boolean = true):ProjectNode {
    var node:ProjectNode = new ProjectNode();
    var dependencyNode = (root ? unlinkedNode : unlinkedNode['dependencies']);
    if (dependencyNode != undefined) {
      for (var key in dependencyNode) {
        node.dependencies[key] = ProjectNode.link(dependencyNode[key], false);
        node.dependencies[key].parent = node;
      }
    }
    if (!root) {
      if (unlinkedNode['group'] != undefined) {
        node.group = unlinkedNode['group'];
      }
      if (unlinkedNode['version'] != undefined) {
        node.version = unlinkedNode['version'];
      }
      if (unlinkedNode['versions'] != undefined) {
        node.versions = unlinkedNode['versions'];
      }
      if (unlinkedNode['problems'] != undefined) {
        node.problems = unlinkedNode['problems'];
      }
      if (unlinkedNode['$ref'] != undefined) {
        node.reference = "#/dependencies" + unlinkedNode['$ref'].substring(1);
      }
      if (unlinkedNode['tags'] != undefined) {
        node.tags = unlinkedNode['tags'];
      }
    }
    return node;
  }

}

