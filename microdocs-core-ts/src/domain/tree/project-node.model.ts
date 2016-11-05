
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
    removeList.forEach(node => this.removeDependency(node));
    this.dependencies.push(dependencyNode);
    if(dependencyNode.item){
      dependencyNode.item.parent = this;
    }
  }

  public removeDependency(dependencyNode:DependencyNode):void{
    let index = this.dependencies.indexOf(dependencyNode);
    if(index > -1){
      this.dependencies.splice(index, 1);
    }
    if(dependencyNode.item){
      dependencyNode.item.parent = null;
    }
  }

  public getRoot():ProjectTree {
    return this.parent.getRoot();
  }

  public findNodePath(title:string, version:string):string {
    for(var i = 0; i < this.dependencies.length; i++){
      var dependency = this.dependencies[i];
      if (dependency.item.title === title && dependency.item.version === version) {
        return title + "/item";
      }
      var path = dependency.item.findNodePath(title, version);
      if (path != null) {
        return title + '/item/dependencies/' + path;
      }
    }
    return null;
  }

  public resolve(){
    if(this.reference){
      var result = this.resolveReference(this.reference);
      if(result == null){
        throw new Error("Unknown dependency reference: " + this.reference);
      }
      return result;
    }
    return this;
  }

  public resolveReference(reference:string):Node{
    if(reference.indexOf('#/') == 0){
      return this.getRoot().resolveReference(reference);
    }
    if(reference.indexOf('dependencies/') == 0){
      reference = reference.substr('dependencies/'.length);
      var match = reference.match(/^(.*?)\/(.+)$/);
      if(match && match.length >= 2){
        var title = match[1];
        var results = this.dependencies.filter(dependencyNode => dependencyNode.item.title === title);
        if(results.length > 0){
          if(match.length > 2){
            return results[0].resolveReference(match[2]);
          }else{
            return results[0];
          }
        }
      }else{
        var results = this.dependencies.filter(dependencyNode => dependencyNode.item.title === reference);
        if(results.length > 0){
          return results[0];
        }
      }
    }
    return null;
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
      project.reference = unlinkedProject['$ref'];
    }
    if (unlinkedProject['tags']) {
      project.tags = unlinkedProject['tags'];
    }
    return project;
  }

}

