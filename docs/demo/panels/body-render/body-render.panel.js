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
const angular2_prettyjson_1 = require('angular2-prettyjson');
const schema_helper_1 = require('microdocs-core-ts/dist/helpers/schema/schema.helper');
const filters_1 = require("@maxxton/components/filters");
let BodyRenderPanel = class BodyRenderPanel {
    ngOnInit() {
        this.example = schema_helper_1.SchemaHelper.generateExample(this.schema);
    }
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', Array)
], BodyRenderPanel.prototype, "contentTypes", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Object)
], BodyRenderPanel.prototype, "schema", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Array)
], BodyRenderPanel.prototype, "mimes", void 0);
BodyRenderPanel = __decorate([
    core_1.Component({
        selector: 'body-render',
        template:'<div class=body-render-header><template [ngIf]="example | notEmpty"><h5>Body<template [ngIf]="mimes | notEmpty">(<span class=mime *ngFor="let mime of mimes; let last = last">{{mime}}<template [ngIf]=!last>,</template></span>)</template></h5><prettyjson [obj]=example></prettyjson></template></div>',
        directives: [angular2_prettyjson_1.PrettyJsonComponent],
        pipes: [filters_1.FILTERS]
    }), 
    __metadata('design:paramtypes', [])
], BodyRenderPanel);
exports.BodyRenderPanel = BodyRenderPanel;
