import {Component, Input} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {PrettyJsonComponent} from 'angular2-prettyjson';

import {COMPONENTS} from "@maxxton/components/dist/components";
import {FILTERS} from "@maxxton/components/dist/filters";
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";
import {Schema} from "microdocs-core-ts/dist/domain";

@Component({
  selector: 'model-panel',
  templateUrl: 'model-panel.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS, PrettyJsonComponent],
  pipes: [FILTERS]
})
export class ModelPanel {

  @Input()
  schema:Schema;
  @Input()
  sourceLink:string;

  example:{};

  ngOnInit() {
    this.example = SchemaHelper.generateExample(this.schema);
  }

  getSubTitle(schema:Schema){
    var tables = "";
    if(schema.mappings != undefined && schema.mappings != null &&
          schema.mappings.relational != undefined && schema.mappings.relational != null &&
          schema.mappings.relational.tables != undefined && schema.mappings.relational.tables != null){
      schema.mappings.relational.tables.forEach(table => tables += table + ", ");
      if(tables.length > 1){
        tables = "(" + tables.substring(0, tables.length-2) + ")";
      }
    }
    return tables;
  }

}