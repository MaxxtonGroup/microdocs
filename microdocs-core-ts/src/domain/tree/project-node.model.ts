
import {Node} from "./node.model";
import {ProjectTree} from "./project-tree.model";
import {DependencyNode} from "./dependency-node.model";
import { SchemaHelper } from "../../helpers/schema/schema.helper";

export class ProjectNode extends Node{
  
  public dependencies:DependencyNode[] = [];

  constructor(public title?:string,
              public parent:Node = null,
              public group?:string,
              public version?:string,
              public versions?:string[],
              public problems?:number,
              public reference?:string,
              public tags?:string[]) {
    super();
  }

  public addDependency( dependencyNode:DependencyNode):void{
    var removeList = this.dependencies.filter(node => node.item.title === dependencyNode.item.title);
    removeList.forEach(node => delete this.dependencies[this.dependencies.indexOf(node)]);
    this.dependencies.push(dependencyNode);
  }

  public getRoot():ProjectTree {
    return this.parent.getRoot();
  }

  public findNodePath(title:string, version:string):string {
    for(var i = 0; i < this.dependencies.length; i++){
      var dependency = this.dependencies[i];
      if (dependency.item.title === title && dependency.item.version === version) {
        return "/dependencies/" + title + "/item";
      }
      var path = dependency.item.findNodePath(title, version);
      if (path != null) {
        return "/dependencies/" + title + '/item' + path;
      }
    }
    return null;
  }

  public resolve(){
    if(this.reference){
      var ref = '#/projects/' + this.reference.substr(2);
      var result = SchemaHelper.resolveReference(ref, this.getRoot());
      if(result == null){
        throw new Error("Unknown dependency reference: " + this.reference);
      }
      return result;
    }
    return this;
  }

  public unlink():{} {
    if (this.reference) {
      return {
        '$ref': this.reference
      };
    }
    
    var dependencies:{[title:string]:{}} = {};
    this.dependencies.forEach(dependency => {
      var child = {
        item: dependency.item.unlink()
      };
      if(dependency.problems){
        child['problems'] = dependency.problems;
      }
      if(dependency.type){
        child['type'] = dependency.type;
      }
      dependencies[dependency.item.title] = child;
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
  
  public static link(unlinkedProject:{}, title:string):ProjectNode{
    var project = new ProjectNode(title);
    if(unlinkedProject['dependencies']){
      for(let key in unlinkedProject['dependencies']){
        let unlinkedDependency = unlinkedProject['dependencies'][key];
        let dependency = DependencyNode.link(unlinkedDependency, key);
        if(dependency.item){
          dependency.item.parent = project;
        }
        project.dependencies.push(dependency);
      }
    }
    if (unlinkedProject['group']) {
      project.group = unlinkedProject['group'];
    }
    if (unlinkedProject['version']) {
      project.version = unlinkedProject['version'];
    }
    if (unlinkedProject['versions']) {
      project.versions = unlinkedProject['versions'];
    }
    if (unlinkedProject['problems']) {
      project.problems = unlinkedProject['problems'];
    }
    if (unlinkedProject['$ref']) {
      project.reference = "#/dependencies" + unlinkedProject['$ref'].substring(1);
    }
    if (unlinkedProject['tags']) {
      project.tags = unlinkedProject['tags'];
    }
    return project;
  }

}

