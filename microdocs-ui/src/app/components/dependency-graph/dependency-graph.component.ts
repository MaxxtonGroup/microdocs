import { Component, Input, SimpleChanges, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import * as d3 from "d3";
import "d3-force";
import { Subject, Subscription } from "rxjs";
import { ProjectService } from "../../services/project.service";
import { DependencyNode, DependencyTypes, ProjectNode, ProjectTree } from "@maxxton/microdocs-core/domain";
import { StringUtil } from "app/helpers/string.util";

// import {Observable} from "rxjs";

@Component( {
  selector: 'dependency-graph',
  templateUrl: 'dependency-graph.component.html'
} )
export class DependencyGraphComponent {

  private error: string;
  private force: any;
  private data: ProjectTree;
  private subscription: Subscription;

  private dropdownExpanded: boolean = false;
  private groupToggles: Array<GroupItem> = [];

  @Input()
  nodes: Subject<ProjectTree>;

  @Input()
  projectName: string;

  @Input()
  env: string;

  @Input()
  showVersions: boolean = false;

  @Input()
  showInheritance: boolean = true;

  @Input()
  showOptionBar: boolean = true;

  @Input()
  small: boolean = false;

  constructor( private containerRef: ViewContainerRef, private router: Router, private projectService: ProjectService ) {
    this.showVersions = this.isShowVersions();
    this.showInheritance = this.isShowInheritance();
  }

  ngOnChanges( changes: SimpleChanges ) {
    this.nodes.next( this.data );
  }

  ngOnInit() {

    this.subscription = this.nodes.subscribe( data => {
      this.data = data;
      this.groupToggles = [];
      if ( this.data && this.data.projects ) {
        this.data.projects.forEach( project => {
          if ( this.groupToggles.filter( groupToggle => groupToggle.name === project.group ).length == 0 ) {
            this.groupToggles.push( new GroupItem( project.group, this.isGroupVisible( project.group ) ) );
          }
        } );
      }
      this.updateData();
    } );
  }

  private updateData() {
    const newTree = new ProjectTree();
    if ( this.data && this.data.projects ) {
      this.data.projects
        .filter( projectNode => this.groupToggles.filter( groupToggle => groupToggle.name === projectNode.group && groupToggle.visible ).length > 0 )
        .forEach( projectNode => newTree.addProject( projectNode ) );

      if ( this.projectName ) {
        const removeNodes: Array<ProjectNode> = [];
        newTree.projects.forEach( projectNode => {
          if ( projectNode.title !== this.projectName ) {
            if ( (projectNode.dependencies == undefined || projectNode.dependencies.filter( dependency => dependency.item.title === this.projectName ).length == 0) &&
              newTree.projects.filter( projectNode => projectNode.title === this.projectName ).filter( node => node.dependencies.filter( dep => dep.item.title === projectNode.title ).length > 0 ).length == 0 ) {
              removeNodes.push( projectNode );
            } else {
              projectNode.dependencies.filter( dependency => dependency.item.title !== this.projectName ).forEach( dependency => projectNode.removeDependency( dependency ) );
            }
          }
        } );
        removeNodes.forEach( projectNode => newTree.removeProject( projectNode ) );
      }
    }
    const transformedData = this.transformData( newTree );
    this.chartData( transformedData );
  }

  ngOnDestroy() {
    if ( this.subscription ) {
      this.subscription.unsubscribe();
    }
  }

  onResize() {
    if ( this.force != undefined ) {
      this.updateData();
    }
  }

  ngAfterViewInit() {
    setTimeout( () => this.onResize(), 200 );
  }

  navigate( name: string ) {
    const segments = name.split( ":" );
    name = segments[ 0 ];
    let version = segments[ 1 ];
    const results = this.data.projects.filter( projectNode => projectNode.title === name );
    if ( results.length == 0 ) {
      console.error( 'could not find project ' + name );
    } else {
      if ( !version ) {
        version = results[ 0 ].version;
      }
      this.router.navigate( [ '/projects/' + name ], {
        queryParams: {
          version,
          env: this.projectService.getSelectedEnv()
        }
      } );
    }
  }

  isGroupVisible( name: string ): boolean {
    const value = window.localStorage.getItem( 'dashboard.visible-groups.' + name );
    if ( value === 'false' ) {
      return false;
    }
    return true;
  }

  toggleGroup( item: GroupItem ): void {
    item.visible = !item.visible;
    const key = 'dashboard.visible-groups.' + item.name;
    if ( !item.visible ) {
      localStorage.setItem( key, 'false' );
    } else {
      localStorage.removeItem( key );
    }
    this.updateData();
  }

  toggleShowVersions() {
    this.showVersions = !this.showVersions;
    const key = 'dashboard.showVersions';
    if ( this.showVersions ) {
      localStorage.setItem( key, 'true' );
    } else {
      localStorage.removeItem( key );
    }
    this.updateData();
  }

  isShowVersions(): boolean {
    const value = window.localStorage.getItem( 'dashboard.showVersions' );
    if ( value === 'true' ) {
      return true;
    }
    return false;
  }

  toggleShowInheritance() {
    this.showInheritance = !this.showInheritance;
    const key = 'dashboard.showInheritance';
    if ( !this.showInheritance ) {
      localStorage.setItem( key, 'false' );
    } else {
      localStorage.removeItem( key );
    }
    this.updateData();
  }

  isShowInheritance(): boolean {
    const value = window.localStorage.getItem( 'dashboard.showInheritance' );
    if ( value === 'false' ) {
      return false;
    }
    return true;
  }

  transformData( projectTree: ProjectTree ) {
    const nodes = {};
    const links = [];
    if ( projectTree.projects ) {
      let tree = projectTree;
      if ( this.showVersions ) {
        const newTree: ProjectTree = new ProjectTree();
        tree.projects.forEach( projectNode => this.transformFlatList( projectNode, newTree ) );
        tree = newTree;
      }
      if ( !this.showInheritance ) {
        tree = this.transformInheritance( tree );
      }
      tree.projects.forEach( projectNode => {
        nodes[ projectNode.title ] = { name: projectNode.title, group: projectNode.group, color: projectNode.color };
        if ( projectNode.dependencies ) {
          projectNode.dependencies.forEach( dependency => {
            try {
              const item = dependency.item.resolve() as ProjectNode;
              links.push( {
                source: projectNode.title,
                target: item.title,
                type: dependency.type,
                problems: dependency.problems
              } );
            } catch ( e ) {
            }
          } );
        }
      } );
    }
    return { nodes, links };
  }

  transformFlatList( projectNode: ProjectNode, projectTree: ProjectTree ) {
    const dependencies: Array<DependencyNode> = [];
    if ( projectNode.dependencies ) {
      projectNode.dependencies.forEach( dependency => {
        let item: ProjectNode = dependency.item;
        if ( item.reference ) {
          try {
            item = (item.resolve() as ProjectNode);
          } catch ( e ) {
            return;
          }
        } else {
          this.transformFlatList( item, projectTree );
        }
        const newRefNode = new ProjectNode( item.title + ":" + item.version );
        newRefNode.color = item.color;
        newRefNode.reference = "#/" + item.title + ":" + item.version;
        const newDependency = new DependencyNode( newRefNode, dependency.type, dependency.problems );
        dependencies.push( newDependency );
      } );
    }
    const newProjectNode = new ProjectNode( projectNode.title + ":" + projectNode.version, projectTree, projectNode.group, projectNode.version, projectNode.versions, projectNode.problems );
    newProjectNode.color = projectNode.color;
    dependencies.forEach( dep => newProjectNode.addDependency( dep ) );
    projectTree.addProject( newProjectNode );
  }

  transformInheritance( projectTree: ProjectTree ): ProjectTree {
    const newTree: ProjectTree = new ProjectTree();
    const removeNodes: Array<string> = [];
    projectTree.projects.forEach( projectNode => {
      newTree.addProject( this.transformInheritanceProject( projectNode, removeNodes ) );
    } );
    const removeList = newTree.projects.filter( projectNode => removeNodes.filter( removeNode => projectNode.title === removeNode ).length > 0 );
    removeList.forEach( projectNode => newTree.removeProject( projectNode ) );
    return newTree;
  }

  transformInheritanceProject( projectNode: ProjectNode, removeNodes: Array<string> ): ProjectNode {
    const newNode = new ProjectNode( projectNode.title, undefined, projectNode.group, projectNode.version, projectNode.versions, projectNode.problems );
    newNode.color = projectNode.color;
    if ( projectNode.dependencies ) {
      const addDeps: Array<DependencyNode> = [];
      const removeDeps: Array<DependencyNode> = [];
      projectNode.dependencies.forEach( dependencyNode => {
        let newDep;
        if ( !dependencyNode.item.reference ) {
          newDep = new DependencyNode( this.transformInheritanceProject( dependencyNode.item, removeNodes ), dependencyNode.type, dependencyNode.problems );
        } else {
          const refProjectNode = new ProjectNode( dependencyNode.item.title );
          refProjectNode.color = dependencyNode.item.color;
          refProjectNode.reference = dependencyNode.item.reference;
          newDep = new DependencyNode( refProjectNode, dependencyNode.type, dependencyNode.problems );
        }
        newNode.addDependency( newDep );

        if ( newDep.type === DependencyTypes.INCLUDES ) {
          removeDeps.push( newDep );
          const item = dependencyNode.item.resolve() as ProjectNode;
          removeNodes.push( item.title );
          const newSubNode = this.transformInheritanceProject( item, removeNodes );
          newSubNode.dependencies.forEach( dep => addDeps.push( dep ) );
        }
      } );
      removeDeps.forEach( dep => newNode.removeDependency( dep ) );
      addDeps.forEach( dep => newNode.addDependency( dep ) );
    }
    return newNode;
  }

  chartData( data: {} ): void {
    if ( this.force ) {
      this.force.stop();
    }
    const { width, height } = this.containerRef.element.nativeElement.getBoundingClientRect();
    const nodes = data[ 'nodes' ];
    const links = data[ 'links' ];
    const self = this;
    const forceNodes = Object.keys( nodes ).map( ( key, id ) => ({ ...nodes[ key ], key: nodes[ key ].name }) );
    console.log( forceNodes );



    const transform = d => "translate(" + d.x + "," + d.y + ")";


    d3.select( this.containerRef.element.nativeElement ).select( '.container' ).select( 'svg' ).remove();
    if ( !data || data[ 'links' ].length === 0 ) {
      // handle
      console.warn( 'No chart data' );

      return;
    }
    this.error = null;

    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    const zoom = d3.zoom()
      .scaleExtent( [ 1, 10 ] )
      .on( "zoom", zoomed );

    const svg = d3.select( this.containerRef.element.nativeElement )
      .select( '.container' )
      .append( "svg" )
      .attr( "width", width + margin.left + margin.right )
      .attr( "height", height + margin.top + margin.bottom )
      .append( "g" )
      .attr( "transform", "translate(" + margin.left + "," + margin.right + ")" )
      .call( zoom );

    const rect = svg.append( "rect" )
      .attr( "width", width )
      .attr( "height", height )
      .style( "fill", "none" )
      .style( "pointer-events", "all" );

    const container = svg.append( "g" );

    this.force = d3
      .forceSimulation(forceNodes)
      .force("forceX", d3.forceX().strength(.1).x(width * .5))
      .force("forceY", d3.forceY().strength(.1).y(height * .5))
      .force("center", d3.forceCenter().x(width * .5).y(height * .5))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("link", d3.forceLink(links)
        .id((d: any) => d.name)
        .strength(.3)
        .distance(150)
      )
      .on( "tick", tick );

    // Per-type markers, as they don't inherit styles.
    container.append( "defs" ).selectAll( "marker" )
      .data( [ "marker-end", "marker-end-problems", "marker-end-uses" ] )
      .enter().append( "marker" )
      .attr( "id", d => d )
      .attr( "viewBox", "0 -5 10 10" )
      .attr( "refX", 15 )
      .attr( "refY", -1.5 )
      .attr( "markerWidth", 6 )
      .attr( "markerHeight", 6 )
      .attr( "orient", "auto" )
      .append( "path" )
      .attr( 'class', d => {
        if ( d === 'marker-end-problems' ) {
          return 'marker-end-problems';
        } else if ( d === 'marker-end-uses' ) {
          return 'marker-end-uses';
        }
      } )
      .attr( "d", "M0,-5L10,0L0,5" );


    const path = container.append( "g" ).selectAll( "path" )
      .data( links )
      .enter().append( "path" )
      .attr( "class", ( d: any ) => {
        const problems = d.problems && d.problems > 0 ? ' errors' : '';
        return "overview-link " + d.type + problems;
      } )
      .attr( "marker-end", ( d: any ) => {
        const hasProblems = d.problems && d.problems > 0;
        let suffix = '';
        if ( hasProblems ) {
          suffix = '-problems';
        } else if ( d.type === DependencyTypes.USES ) {
          suffix = '-uses';
        }
        return "url(#marker-end" + suffix + ")";
      } );

    const circle = container.append( "g" ).selectAll( "circle" )
      .data( self.force.nodes() )
      .enter().append( "circle" )
      .attr( "r", 6 )
      .attr( "class", ( d: any ) => {
        if ( d.color ) {
          return d.color;
        }
        return d.group ? StringUtil.getColorCodeFromString( d.group ) : 'dark-gray';
      } );


    const text = container.append( "g" ).selectAll( "text" )
      .data( self.force.nodes() )
      .enter().append( "text" )
      .attr( "x", 8 )
      .attr( "y", ".31em" )
      .on(
        "click", ( content ) => {
          self.navigate( content.target.textContent );
        }
      )
      .text( ( d: any ) => d.name );



    function tick() {
      path.attr( "d", linkArc );
      circle.attr( "transform", transform );
      text.attr( "transform", transform );
    }

    function linkArc( d ) {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt( dx * dx + dy * dy );
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }


    function zoomed(event: any) {
      container.attr( "transform", `translate(${event.transform.x},${event.transform.y})scale(${event.transform.k})` );
    }

    function dragstarted( d ) {
//      (((d3 as any).event) as any).sourceEvent.stopPropagation();
      d3.select( this ).classed( "dragging", true );
    }

    function dragged( d ) {
//      d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended( d ) {
      d3.select( this ).classed( "dragging", false );
    }


  }

}

export class GroupItem {

  constructor( public name: string, public visible: boolean = true ) {

  }

}
