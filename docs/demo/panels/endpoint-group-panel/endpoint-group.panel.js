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
const core_1 = require("@angular/core");
const index_1 = require("@maxxton/components/filters/index");
const sort_by_http_method_pipe_1 = require("../../pipes/sort-by-http-method.pipe");
const endpoint_panel_1 = require("../endpoint-panel/endpoint.panel");
const index_2 = require("@maxxton/components/components/index");
const router_1 = require("@angular/router");
const path_highlight_panel_1 = require("../path-highlight-panel/path-highlight.panel");
/**
 * @author Steven Hermans
 */
let EndpointGroupPanel = class EndpointGroupPanel {
    constructor() {
        this.hidden = true;
    }
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', Object)
], EndpointGroupPanel.prototype, "endpointGroup", void 0);
EndpointGroupPanel = __decorate([
    core_1.Component({
        selector: 'endpoint-group',
        template:'<div class=group-header (click)="hidden = !hidden"><path-highlight class=path [path]=endpointGroup._id></path-highlight><span class=methods *ngIf=hidden><span *ngFor="let endpoint of endpointGroup | objectIterator | sortByHttpMethod:\'_id\'" [class]="endpoint._id | lowercase">{{endpoint._id | uppercase}}<template [ngIf]="endpoint.problems | notEmpty"><span class="icon red">error</span></template></span></span></div><div class=group-content [class.hidden]=hidden><div class=methods *ngFor="let endpoint of endpointGroup | objectIterator | sortByHttpMethod:\'_id\'"><span [class]="endpoint._id | lowercase">{{endpoint._id | uppercase}}</span><endpoint [path]=endpointGroup._id [endpoint]=endpoint></endpoint></div></div>',
        directives: [router_1.ROUTER_DIRECTIVES, index_2.COMPONENTS, endpoint_panel_1.EndpointPanel, path_highlight_panel_1.PathHighlightPanel],
        pipes: [index_1.FILTERS, sort_by_http_method_pipe_1.SortByHttpMethod]
    }), 
    __metadata('design:paramtypes', [])
], EndpointGroupPanel);
exports.EndpointGroupPanel = EndpointGroupPanel;
