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
const core_1 = require('@angular/core');
const router_1 = require("@angular/router");
const components_1 = require("@maxxton/components/components");
const filters_1 = require("@maxxton/components/filters");
const body_render_panel_1 = require('../body-render/body-render.panel');
const problem_panel_1 = require("../problem-panel/problem.panel");
let EndpointPanel = class EndpointPanel {
    getStatusName(statusCode) {
        switch (statusCode.trim()) {
            case '200': return 'OK';
            case '201': return 'CREATED';
            case '204': return 'NO CONTENT';
            case '400': return 'BAD REQUEST';
            case '401': return 'UNAUTHORIZED';
            case '403': return 'FORBIDDEN';
            case '404': return 'NOT FOUND';
            case '405': return 'METHOD NOT ALLOWED';
            case '409': return 'CONFLICT';
            case '500': return 'INTERNAL SERVER ERROR';
            case '503': return 'SERVICE UNAVAILABLE';
            default: return '';
        }
    }
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', Object)
], EndpointPanel.prototype, "endpoint", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', String)
], EndpointPanel.prototype, "path", void 0);
EndpointPanel = __decorate([
    core_1.Component({
        selector: 'endpoint',
        template:'<template [ngIf]="endpoint.problems | notEmpty"><problem-panel [problems]=endpoint.problems></problem-panel></template><div class=description><span *ngIf="endpoint.operationId | notEmpty"><a *ngIf="endpoint | notEmpty:\'method.sourceLink\'" class=link [href]=endpoint.method.sourceLink target=_blank>{{endpoint.operationId}}()</a> <span *ngIf="endpoint | empty:\'method.sourceLink\'">{{endpoint.operationId}}</span> <span *ngIf="endpoint.description | notEmpty">-</span></span> {{endpoint.description}}</div><template [ngIf]="endpoint.parameters | notEmpty"><h4>Request</h4><div class=request><template [ngIf]="endpoint.parameters | filterByField:\'in\':[\'query\',\'path\'] | notEmpty"><h5>Parameters</h5><ul><table class=parameter-table><tr *ngFor="let parameter of endpoint.parameters | filterByField:\'in\':[\'query\',\'path\']"><th>{{parameter.name}}</th><td>{{parameter.type}}</td><td><span *ngIf="parameter.default | notEmpty">{{parameter.default}}</span></td><td><span *ngIf=parameter.required>(required)</span></td><td class=description *ngIf="parameter.description | notEmpty">{{parameter.description}}</td></tr></table></ul></template><template [ngIf]="endpoint.parameters | filterByField:\'in\':\'body\' | notEmpty"><div *ngFor="let body of endpoint.parameters | filterByField:\'in\':\'body\'"><body-render [schema]=body.schema [schemaList]=schemaList [mimes]=endpoint.consumes></body-render></div></template></div></template><template [ngIf]="endpoint.responses | notEmpty"><h4>Response</h4><div *ngFor="let response of endpoint.responses | objectIterator | filterByField:\'_id\':\'default\'"><template [ngIf]="response | notEmpty"><div class="description response-description">{{response.description}}</div></template></div><div *ngFor="let response of endpoint.responses | objectIterator | sortByKey:\'_id\'" class=response><template [ngIf]="response | notEmpty"><div class="description response-description"><template [ngIf]="response._id != \'default\'"><span class=response-status>{{response._id + \' \' + getStatusName(response._id)}}</span><template [ngIf]="response.description | notEmpty"><span>- {{response.description}}</span></template></template></div><template [ngIf]="response.schema | notEmpty"><body-render [schema]=response.schema [mimes]=endpoint.produces></body-render></template></template></div></template>',
        directives: [router_1.ROUTER_DIRECTIVES, components_1.COMPONENTS, body_render_panel_1.BodyRenderPanel, problem_panel_1.ProblemPanel],
        pipes: [filters_1.FILTERS]
    }), 
    __metadata('design:paramtypes', [])
], EndpointPanel);
exports.EndpointPanel = EndpointPanel;
