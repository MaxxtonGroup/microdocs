"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var d3 = require('d3');
var Observable_1 = require("rxjs/Observable");
// import {Observable} from "rxjs";
var DependencyGraph = (function () {
    function DependencyGraph(containerRef, router) {
        this.containerRef = containerRef;
        this.router = router;
    }
    DependencyGraph.prototype.ngOnInit = function () {
        var _this = this;
        this.nodes.subscribe(function (data) {
            _this.data = data;
            var dependencies = {};
            Object.keys(data.dependencies).forEach(function (key) { return dependencies[key] = data.dependencies[key]; });
            if (_this.projectName) {
                var removeNames = [];
                for (var key in dependencies) {
                    if (key !== _this.projectName) {
                        if (dependencies[key].dependencies == undefined || dependencies[key].dependencies[_this.projectName] == undefined) {
                            removeNames.push(key);
                        }
                        else {
                            var removeDeps = [];
                            for (var depName in dependencies[key].dependencies) {
                                if (depName != _this.projectName) {
                                    removeDeps.push(depName);
                                }
                            }
                            removeDeps.forEach(function (name) { return delete dependencies[key].dependencies[name]; });
                        }
                    }
                }
                removeNames.forEach(function (name) { return delete dependencies[name]; });
            }
            _this.filteredData = { dependencies: dependencies };
            var transformedData = _this.transformData(_this.filteredData);
            _this.chartData(transformedData);
        });
    };
    DependencyGraph.prototype.onResize = function () {
        if (this.force != undefined) {
            this.force.size([this.containerRef.element.nativeElement.getBoundingClientRect().width, this.containerRef.element.nativeElement.getBoundingClientRect().height]);
        }
    };
    DependencyGraph.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { return _this.onResize(); }, 200);
    };
    DependencyGraph.prototype.navigate = function (name) {
        var project = this.data.dependencies[name];
        if (project == undefined) {
            console.error('could not find project ' + name);
        }
        else {
            var envString = (this.env ? '?env=' + this.env : '');
            this.router.navigateByUrl('/projects/' + project.group + "/" + name + envString);
        }
    };
    DependencyGraph.prototype.transformData = function (data) {
        var nodes = {};
        var links = [];
        if (data.dependencies != undefined) {
            for (var key in data.dependencies) {
                nodes[key] = ({ name: key });
                var node = data.dependencies[key];
                if (node.dependencies != undefined) {
                    for (var key2 in node.dependencies) {
                        var dependency = node.dependencies[key2];
                        if (typeof (dependency['$ref']) == 'string' && dependency['$ref'].indexOf('#/dependencies/')) {
                            var name = dependency['$ref'].substring('#/dependencies/'.length);
                            dependency = data.dependencies[name];
                        }
                        links.push({ source: key, target: key2, type: 'rest' });
                    }
                }
            }
        }
        return { nodes: nodes, links: links };
    };
    DependencyGraph.prototype.chartData = function (data) {
        var svg = d3.select(this.containerRef.element.nativeElement).select('.container').select('svg').remove();
        if (!data) {
            //handle
            console.warn('No chart data');
            return;
        }
        this.error = null;
        var nodes = data['nodes'];
        var links = data['links'];
        links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
            link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
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
            "click": function () {
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
            var dx = d.target.x - d.source.x, dy = d.target.y - d.source.y, dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        }
        function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Observable_1.Observable)
    ], DependencyGraph.prototype, "nodes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DependencyGraph.prototype, "projectName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DependencyGraph.prototype, "env", void 0);
    DependencyGraph = __decorate([
        core_1.Component({
            selector: 'dependency-graph',
            template: '<div class="container" (window:resize)="onResize($event)"></div>'
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, router_1.Router])
    ], DependencyGraph);
    return DependencyGraph;
}());
exports.DependencyGraph = DependencyGraph;
