import {Component, ViewContainerRef, Input} from "@angular/core";
import {Router} from "@angular/router";
import * as d3 from 'd3';

import {TreeNode} from "microdocs-core-ts/dist/domain";
import {Observable} from "rxjs/Observable";

// import {Observable} from "rxjs";

@Component({
  selector: 'dependency-graph',
  template: '<div class="container" (window:resize)="onResize($event)"></div>'
})
export class DependencyGraph {

  error:string;
  force:any;
  data:TreeNode;

  @Input()
  nodes:Observable<TreeNode>;

  constructor(private containerRef:ViewContainerRef, private router:Router) {
  }

  ngOnInit(){
    this.nodes.subscribe(data => {
      this.data = data;
      var transformedData = this.transformData(this.data);
      this.chartData(transformedData);
    });
  }

  onResize() {
    if (this.force != undefined) {
      this.force.size([this.containerRef.element.nativeElement.getBoundingClientRect().width,this.containerRef.element.nativeElement.getBoundingClientRect().height]);
      // this.force.restart();
      // this.force.force('size', [this.containerRef.element.nativeElement.getBoundingClientRect().width, this.containerRef.element.nativeElement.getBoundingClientRect().height]);
    }
  }

  ngAfterViewInit(){
    setTimeout(() => this.onResize(), 200);
  }

  navigate(name:string){
    var project = this.data.dependencies[name];
    if(project == undefined){
      console.error('could not find project ' + name);
    }else{
      this.router.navigateByUrl('/projects/' + project.group + "/" + name);
    }
  }

  transformData(data:TreeNode) {
    var nodes = {};
    var links = [];
    if (data.dependencies != undefined) {
      for (var key in data.dependencies) {
        nodes[key] = ({name: key});
        var node = data.dependencies[key];
        if (node.dependencies != undefined) {
          for (var key2 in node.dependencies) {
            var dependency = node.dependencies[key2];
            if(typeof(dependency['$ref']) == 'string' && dependency['$ref'].indexOf('#/dependencies/')){
              var name = dependency['$ref'].substring('#/dependencies/'.length);
              dependency = data.dependencies[name];
            }
            links.push({source: key, target: key2, type: 'rest'});
          }
        }
      }
    }
    return {nodes: nodes, links: links};
  }

  chartData(data:{}):void {
    if (data == null) {
      //handle
      return;
    }
    this.error = null;
    var nodes = data['nodes']
    var links = data['links'];
    links.forEach(function (link) {
      link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
      link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });

    var svg = d3.select(this.containerRef.element.nativeElement).select('.container').append("svg");
    this.force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([this.containerRef.element.nativeElement.getBoundingClientRect().width, this.containerRef.element.nativeElement.getBoundingClientRect().height])
      .linkStrength(0.1)
      .charge(-300)
      .on("tick", tick)
      .start();

    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
      .data(["marker-rest", "dependency"])
      .enter().append("marker")
      .attr("id", function (d) {
        return d;
      })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5");

    var self = this;

    var path = svg.append("g").selectAll("path")
      .data(self.force.links())
      .enter().append("path")
      .attr("class", function (d) {
        return "overview-link " + d.type;
      })
      .attr("marker-end", function (d) {
        return "url(#marker-" + d.type + ")";
      });

    var circle = svg.append("g").selectAll("circle")
      .data(self.force.nodes())
      .enter().append("circle")
      .attr("r", 6)
      .call(self.force.drag);

    var text = svg.append("g").selectAll("text")
      .data(self.force.nodes())
      .enter().append("text")
      .attr("x", 8)
      .attr("y", ".31em")
      .on({
        "click": function(){
          self.navigate(this.textContent);
        }
      })
      .text(function (d) {
        return d.name;
      });

    function tick() {
      path.attr("d", linkArc);
      circle.attr("transform", transform);
      text.attr("transform", transform);
    }

    function linkArc(d) {
      var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }
  }

}