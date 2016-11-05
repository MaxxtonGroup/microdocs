import { Component, ViewContainerRef, Input, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import * as d3 from 'd3';

import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { ProjectService } from "../../services/project.service";
import * as colorHelper from '../../helpers/color.helper';
import { ProjectTree, ProjectNode, DependencyNode, DependencyTypes } from "@maxxton/microdocs-core/domain";

// import {Observable} from "rxjs";

@Component( {
  selector: 'dependency-graph',
  templateUrl: 'dependency-graph.html'
} )
export class DependencyGraph {

  error:string;
  force:any;
  data:ProjectTree;
  subscription:Subscription;

  dropdownExpanded:boolean = false;
  groupToggles:GroupItem[] = [];

  @Input()
  nodes:Subject<ProjectTree>;
  @Input()
  projectName:string;
  @Input()
  env:string;
  @Input()
  showVersions:boolean    = false;
  @Input()
  showInheritance:boolean = true;
  @Input()
  showOptionBar           = true;

  constructor( private containerRef:ViewContainerRef, private router:Router, private projectService:ProjectService ) {
    this.showVersions    = this.isShowVersions();
    this.showInheritance = this.isShowInheritance();
  }

  ngOnChanges( changes:SimpleChanges ) {
    this.nodes.next( this.data );
  }

  ngOnInit() {

    this.subscription = this.nodes.subscribe( data => {
      this.data         = data;
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
    var newTree = new ProjectTree();
    if ( this.data && this.data.projects ) {
      this.data.projects
          .filter( projectNode => this.groupToggles.filter( groupToggle => groupToggle.name === projectNode.group && groupToggle.visible ).length > 0 )
          .forEach( projectNode => newTree.addProject( projectNode ) );

      if ( this.projectName ) {
        var removeNodes:ProjectNode[] = [];
        newTree.projects.forEach( projectNode => {
          if ( projectNode.title !== this.projectName ) {
            if ( (projectNode.dependencies == undefined || projectNode.dependencies.filter(dependency => dependency.item.title === this.projectName).length == 0 ) &&
                newTree.projects.filter(projectNode => projectNode.title === this.projectName).filter(node => node.dependencies.filter(dep => dep.item.title === projectNode.title).length > 0).length == 0){
              removeNodes.push( projectNode );
            } else {
              projectNode.dependencies.filter(dependency => dependency.item.title !== this.projectName).forEach(dependency => projectNode.removeDependency(dependency));
            }
          }
        } );
        removeNodes.forEach( projectNode => newTree.removeProject(projectNode));
      }
    }
    var transformedData = this.transformData( newTree );
    this.chartData( transformedData );
  }

  ngOnDestroy() {
    if ( this.subscription ) {
      this.subscription.unsubscribe();
    }
  }

  onResize() {
    if ( this.force != undefined ) {
      this.force.size( [ this.containerRef.element.nativeElement.getBoundingClientRect().width, this.containerRef.element.nativeElement.getBoundingClientRect().height ] );
      // this.force.restart();
      // this.force.force('size', [this.containerRef.element.nativeElement.getBoundingClientRect().width, this.containerRef.element.nativeElement.getBoundingClientRect().height]);
    }
  }

  ngAfterViewInit() {
    setTimeout( () => this.onResize(), 200 );
  }

  navigate( name:string ) {
    var segments = name.split(":");
    name = segments[0];
    var version = segments[1];
    var results = this.data.projects.filter( projectNode => projectNode.title === name );
    if ( results.length == 0 ) {
      console.error( 'could not find project ' + name );
    } else {
      if(!version){
        version = results[0].version;
      }
      this.router.navigate( [ '/projects/' + name ], {
        queryParams: {
          version: version,
          env: this.projectService.getSelectedEnv()
        }
      } );
    }
  }

  isGroupVisible( name:string ):boolean {
    var value = window.localStorage.getItem( 'dashboard.visible-groups.' + name );
    if ( value === 'false' ) {
      return false;
    }
    return true;
  }

  toggleGroup( item:GroupItem ):void {
    item.visible = !item.visible;
    var key      = 'dashboard.visible-groups.' + item.name;
    if ( !item.visible ) {
      localStorage.setItem( key, 'false' );
    } else {
      localStorage.removeItem( key );
    }
    this.updateData();
  }

  toggleShowVersions() {
    this.showVersions = !this.showVersions;
    var key           = 'dashboard.showVersions';
    if ( this.showVersions ) {
      localStorage.setItem( key, 'true' );
    } else {
      localStorage.removeItem( key );
    }
    this.updateData();
  }

  isShowVersions():boolean {
    var value = window.localStorage.getItem( 'dashboard.showVersions' );
    if ( value === 'true' ) {
      return true;
    }
    return false;
  }

  toggleShowInheritance() {
    this.showInheritance = !this.showInheritance;
    var key              = 'dashboard.showInheritance';
    if ( !this.showInheritance ) {
      localStorage.setItem( key, 'false' );
    } else {
      localStorage.removeItem( key );
    }
    this.updateData();
  }

  isShowInheritance():boolean {
    var value = window.localStorage.getItem( 'dashboard.showInheritance' );
    if ( value === 'false' ) {
      return false;
    }
    return true;
  }

  transformData( projectTree:ProjectTree ) {
    var nodes = {};
    var links = [];
    if ( projectTree.projects ) {
      var tree = projectTree;
      if ( this.showVersions ) {
        var newTree:ProjectTree = new ProjectTree();
        tree.projects.forEach( projectNode => this.transformFlatList( projectNode, newTree ) );
        tree = newTree;
      }
      if(!this.showInheritance){
        tree = this.transformInheritance(tree);
      }
      tree.projects.forEach( projectNode => {
        nodes[ projectNode.title ] = { name: projectNode.title, group: projectNode.group };
        if ( projectNode.dependencies ) {
          projectNode.dependencies.forEach( dependency => {
            try {
              var item = <ProjectNode>dependency.item.resolve();
              links.push( {
                source: projectNode.title,
                target: item.title,
                type: dependency.type,
                problems: dependency.problems
              } );
            }catch(e){}
          } );
        }
      } );
    }
    return { nodes: nodes, links: links };
  }

  transformFlatList( projectNode:ProjectNode, projectTree:ProjectTree ) {
    var dependencies:DependencyNode[] = [];
    if ( projectNode.dependencies ) {
      projectNode.dependencies.forEach( dependency => {
        var item = dependency.item;
        if ( item.reference ) {
          try {
            var item = item.resolve();
          } catch ( e ) {
            return;
          }
        } else {
          this.transformFlatList( item, projectTree );
        }
        var newRefNode       = new ProjectNode(item.title + ":" + item.version);
        newRefNode.reference = "#/" + item.title + ":" + item.version;
        var newDependency    = new DependencyNode( newRefNode, dependency.type, dependency.problems );
        dependencies.push( newDependency );
      } );
    }
    var newProjectNode = new ProjectNode( projectNode.title + ":" + projectNode.version, projectTree, projectNode.group, projectNode.version, projectNode.versions, projectNode.problems );
    dependencies.forEach( dep => newProjectNode.addDependency( dep ) );
    projectTree.addProject( newProjectNode );
  }

  transformInheritance( projectTree:ProjectTree):ProjectTree{
    var newTree:ProjectTree = new ProjectTree();
    var removeNodes:string[] = [];
    projectTree.projects.forEach(projectNode => {
      newTree.addProject(this.transformInheritanceProject(projectNode, removeNodes));
    });
    var removeList = newTree.projects.filter(projectNode => removeNodes.filter(removeNode => projectNode.title === removeNode).length > 0);
    removeList.forEach(projectNode => newTree.removeProject(projectNode));
    return newTree;
  }

  transformInheritanceProject(projectNode:ProjectNode, removeNodes:string[]):ProjectNode{
    var newNode = new ProjectNode(projectNode.title, undefined, projectNode.group, projectNode.version, projectNode.versions, projectNode.problems);
    if(projectNode.dependencies){
      var addDeps:DependencyNode[] = [];
      var removeDeps:DependencyNode[] = [];
      projectNode.dependencies.forEach(dependencyNode => {
        var newDep;
        if(!dependencyNode.item.reference){
          newDep = new DependencyNode(this.transformInheritanceProject(dependencyNode.item, removeNodes), dependencyNode.type, dependencyNode.problems);
        }else{
          var refProjectNode = new ProjectNode(dependencyNode.item.title);
          refProjectNode.reference = dependencyNode.item.reference;
          newDep = new DependencyNode(refProjectNode, dependencyNode.type, dependencyNode.problems );
        }
        newNode.addDependency(newDep);

        if(newDep.type === DependencyTypes.INCLUDES){
          removeDeps.push(newDep);
          var item = <ProjectNode>dependencyNode.item.resolve();
          removeNodes.push(item.title);
          var newSubNode = this.transformInheritanceProject(item, removeNodes);
          newSubNode.dependencies.forEach(dep => addDeps.push(dep));
        }
      });
      removeDeps.forEach(dep => newNode.removeDependency(dep));
      addDeps.forEach(dep => newNode.addDependency(dep));
    }
    return newNode;
  }

  chartData( data:{} ):void {
    var self = this;
    var svg = d3.select( this.containerRef.element.nativeElement ).select( '.container' ).select( 'svg' ).remove();
    if ( !data ) {
      //handle
      console.warn( 'No chart data' );

      return;
    }
    this.error = null;
    var nodes  = data[ 'nodes' ]
    var links  = data[ 'links' ];
    links.forEach( function ( link ) {
      link.source = nodes[ link.source ] || (nodes[ link.source ] = { name: link.source });
      link.target = nodes[ link.target ] || (nodes[ link.target ] = { name: link.target });
    } );

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    var svg    = d3.select( this.containerRef.element.nativeElement )
        .select( '.container' )
        .append( "svg" )
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(zoom);

    var rect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all");

    var container = svg.append("g");

    this.force = d3.layout.force()
        .nodes( d3.values( nodes ) )
        .links( links )
        .size( [ this.containerRef.element.nativeElement.getBoundingClientRect().width, this.containerRef.element.nativeElement.getBoundingClientRect().height ] )
        .linkStrength( 0.1 )
        .charge( -500 )
        .on( "tick", tick )
        .start();

    // Per-type markers, as they don't inherit styles.
    container.append( "defs" ).selectAll( "marker" )
        .data( [ "marker-end", "marker-end-problems" ] )
        .enter().append( "marker" )
        .attr( "id", function ( d ) {
          return d;
        } )
        .attr( "viewBox", "0 -5 10 10" )
        .attr( "refX", 15 )
        .attr( "refY", -1.5 )
        .attr( "markerWidth", 6 )
        .attr( "markerHeight", 6 )
        .attr( "orient", "auto" )
        .append( "path" )
        .attr( 'class', function ( d ) {
          if ( d === 'marker-end-problems' ) {
            return 'problems';
          }
        } )
        .attr( "d", "M0,-5L10,0L0,5" );

    var path = container.append( "g" ).selectAll( "path" )
        .data( self.force.links() )
        .enter().append( "path" )
        .attr( "class", function ( d ) {
          var problems = d.problems && d.problems > 0 ? ' problems' : '';
          return "overview-link " + d.type + problems;
        } )
        .attr( "marker-end", function ( d ) {
          var problems = d.problems && d.problems > 0 ? '-problems' : '';
          return "url(#marker-end" + problems + ")";
        } );

    var circle = container.append( "g" ).selectAll( "circle" )
        .data( self.force.nodes() )
        .enter().append( "circle" )
        .attr( "r", 6 )
        .attr( "class", d => colorHelper.getColorByTitle( d.group ) )
        .call( self.force.drag()
            .origin(function(d) { return d; })
            .on("dragstart", dragstarted)
            .on("drag", dragged)
            .on("dragend", dragended));

    var text = container.append( "g" ).selectAll( "text" )
        .data( self.force.nodes() )
        .enter().append( "text" )
        .attr( "x", 8 )
        .attr( "y", ".31em" )
        .on( {
          "click": function () {
            self.navigate( this.textContent );
          }
        } )
        .text( function ( d ) {
          return d.name;
        } );

    function tick() {
      path.attr( "d", linkArc );
      circle.attr( "transform", transform );
      text.attr( "transform", transform );
    }

    function linkArc( d ) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt( dx * dx + dy * dy );
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform( d ) {
      return "translate(" + d.x + "," + d.y + ")";
    }

    function zoomed() {
      container.attr("transform", "translate(" + (<any>(d3.event)).translate + ")scale(" + (<any>(d3.event)).scale + ")");
    }

    function dragstarted(d) {
      (<any>(d3.event)).sourceEvent.stopPropagation();
      d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
//      d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended(d) {
      d3.select(this).classed("dragging", false);
    }
  }

}

export class GroupItem {

  constructor( public name:string, public visible:boolean = true ) {

  }

}