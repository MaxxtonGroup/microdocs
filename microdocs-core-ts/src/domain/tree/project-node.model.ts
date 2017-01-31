import { FlatList, Node, ProjectTree, DependencyNode, DependencyTypes } from "../";

export class ProjectNode extends Node {

  public dependencies:DependencyNode[] = [];

  constructor( public title?:string,
               public parent:Node = null,
               public group?:string,
               public version?:string,
               public versions?:string[],
               public problems?:number,
               public reference?:string,
               public tags?:string[] ) {
    super();
  }

  public addDependency( dependencyNode:DependencyNode ):void {
    var removeList = this.dependencies.filter( node => node.item.title === dependencyNode.item.title );
    removeList.forEach( node => this.removeDependency( node ) );
    this.dependencies.push( dependencyNode );
    if ( dependencyNode.item ) {
      dependencyNode.item.parent = this;
    }
  }

  public removeDependency( dependencyNode:DependencyNode ):void {
    let index = this.dependencies.indexOf( dependencyNode );
    if ( index > -1 ) {
      this.dependencies.splice( index, 1 );
    }
    if ( dependencyNode.item ) {
      dependencyNode.item.parent = null;
    }
  }

  public getRoot():ProjectTree {
    return this.parent.getRoot();
  }

  public getParent():Node{
    return this.parent;
  }

  /**
   * Get the reference from the root of the tree to this node
   * @return {string}
   */
  public getReference():string{
    if(this.parent === this.getRoot()){
      return this.parent.getReference() + '/' + this.title;
    }else{
      return this.parent.getReference() + '/dependencies/' + this.title + '/item';
    }
  }

  public findNodePath( title:string, version:string ):string {
    for ( var i = 0; i < this.dependencies.length; i++ ) {
      var dependency = this.dependencies[ i ];
      if ( dependency.item.title === title && dependency.item.version === version ) {
        return title + "/item";
      }
      var path = dependency.item.findNodePath( title, version );
      if ( path != null ) {
        return title + '/item/dependencies/' + path;
      }
    }
    return null;
  }

  public resolve() {
    if ( this.reference ) {
      var result = this.resolveReference( this.reference );
      if ( result == null ) {
        throw new Error( "Unknown dependency reference: " + this.reference );
      }
      return result;
    }
    return this;
  }

  /**
   * Find dependencies that uses the given reference
   * @param reference {string} eg. '#/example-project/dependencies/item/child-project'
   * @return {DepencencyNode[]}
   */
  public findReverseDependencies(reference:string):DependencyNode[]{
    let dependencyNodes:DependencyNode[] = [];
    if(this.dependencies) {
      this.dependencies.forEach( dependencyNode => {
        if ( dependencyNode.item ) {
          if ( dependencyNode.item.reference === reference ) {
            dependencyNodes.push( dependencyNode );
          } else {
            dependencyNodes = dependencyNode.item.findReverseDependencies(reference).concat(dependencyNodes);
          }
        }
      } );
    }
    return dependencyNodes;
  }

  public resolveReference( reference:string ):Node {
    if ( reference.indexOf( '#/' ) == 0 ) {
      return this.getRoot().resolveReference( reference );
    }
    if ( reference.indexOf( 'dependencies/' ) == 0 ) {
      reference = reference.substr( 'dependencies/'.length );
      var match = reference.match( /^(.*?)\/(.+)$/ );
      if ( match && match.length >= 2 ) {
        var title   = match[ 1 ];
        var results = this.dependencies.filter( dependencyNode => dependencyNode.item.title === title );
        if ( results.length > 0 ) {
          if ( match.length > 2 ) {
            return results[ 0 ].resolveReference( match[ 2 ] );
          } else {
            return results[ 0 ];
          }
        }
      } else {
        var results = this.dependencies.filter( dependencyNode => dependencyNode.item.title === reference );
        if ( results.length > 0 ) {
          return results[ 0 ];
        }
      }
    }
    return null;
  }

  public toJson():string{
    return JSON.stringify(this.unlink());
  }

  public unlink():{} {
    if ( this.reference ) {
      return {
        '$ref': this.reference
      };
    }

    var dependencies:{[title:string]:{}} = {};
    this.dependencies.forEach( dependency => {
      var child:any = {
        item: dependency.item.unlink()
      };
      if ( dependency.problems ) {
        child.problems = dependency.problems;
      }
      if ( dependency.type ) {
        child.type = dependency.type;
      }
      dependencies[ dependency.item.title ] = child;
    } );

    var node:any = {};
    if ( Object.keys( dependencies ).length > 0 ) {
      node.dependencies = dependencies;
    }
    if ( this.group != null || this.group != undefined ) {
      node.group = this.group;
    }
    if ( this.version != null || this.version != undefined ) {
      node.version = this.version;
    }
    if ( this.versions != null || this.versions != undefined ) {
      node.versions = this.versions;
    }
    if ( this.problems != null || this.problems != undefined ) {
      node.problems = this.problems;
    }
    if ( this.tags != null || this.tags != undefined ) {
      node.tags = this.tags;
    }
    return node;
  }

  public static link( unlinkedProject:any, title:string ):ProjectNode {
    var project = new ProjectNode( title );
    if ( unlinkedProject.dependencies ) {
      for ( let key in unlinkedProject.dependencies ) {
        let unlinkedDependency = unlinkedProject.dependencies[ key ];
        let dependency         = DependencyNode.link( unlinkedDependency, key );
        if ( dependency.item ) {
          dependency.item.parent = project;
        }
        project.dependencies.push( dependency );
      }
    }
    if ( unlinkedProject.group ) {
      project.group = unlinkedProject.group;
    }
    if ( unlinkedProject.version ) {
      project.version = unlinkedProject.version;
    }
    if ( unlinkedProject.versions ) {
      project.versions = unlinkedProject.versions;
    }
    if ( unlinkedProject.problems ) {
      project.problems = unlinkedProject.problems;
    }
    if ( unlinkedProject.$ref ) {
      project.reference = unlinkedProject.$ref;
    }
    if ( unlinkedProject.tags ) {
      project.tags = unlinkedProject.tags;
    }
    return project;
  }

  public toFlatList( excludeSelf:boolean = false, flatList:FlatList = new FlatList(), includeProject:string[] = [] ):FlatList {
    if(!excludeSelf) {
      flatList.addProject( this );
    }
    this.dependencies.forEach( dependencyNode => {
      dependencyNode.item.toFlatList(dependencyNode.type === DependencyTypes.INCLUDES, flatList, includeProject);
      if(dependencyNode.type === DependencyTypes.INCLUDES) {
        includeProject.push( dependencyNode.item.title );
      }
    } );
    this.dependencies = this.dependencies.filter(dependencyNode => dependencyNode.type !== DependencyTypes.INCLUDES);
    return flatList;
  }
}

