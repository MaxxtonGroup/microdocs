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
const router_1 = require("@angular/router");
const angular2_prettyjson_1 = require('angular2-prettyjson');
const components_1 = require("@maxxton/components/components");
const filters_1 = require("@maxxton/components/filters");
const schema_helper_1 = require("microdocs-core-ts/dist/helpers/schema/schema.helper");
let ModelPanel = class ModelPanel {
    ngOnInit() {
        this.example = schema_helper_1.SchemaHelper.generateExample(this.schema);
    }
    getSubTitle(schema) {
        var tables = "";
        if (schema.mappings != undefined && schema.mappings != null &&
            schema.mappings.relational != undefined && schema.mappings.relational != null &&
            schema.mappings.relational.tables != undefined && schema.mappings.relational.tables != null) {
            schema.mappings.relational.tables.forEach(table => tables += table + ", ");
            if (tables.length > 1) {
                tables = "(" + tables.substring(0, tables.length - 2) + ")";
            }
        }
        return tables;
    }
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', Object)
], ModelPanel.prototype, "schema", void 0);
ModelPanel = __decorate([
    core_1.Component({
        selector: 'model-panel',
        template:'<card *ngIf="schema.properties | notEmpty" title={{schema.name}} subTitle={{getSubTitle(schema)}} [private]=true [canFullscreen]=false [hidden]=true class="child-card model-card"><div *ngIf="schema.description | notEmpty">{{schema.description}}</div><div class=link *ngIf="schema.sourceLink | notEmpty"><span class=icon>keyboard_arrow_right</span> <a [href]=schema.sourceLink target=_blank>source</a></div><template [ngIf]="example | notEmpty"><prettyjson [obj]=example></prettyjson></template></card>',
        directives: [router_1.ROUTER_DIRECTIVES, components_1.COMPONENTS, angular2_prettyjson_1.PrettyJsonComponent],
        pipes: [filters_1.FILTERS]
    }), 
    __metadata('design:paramtypes', [])
], ModelPanel);
exports.ModelPanel = ModelPanel;
