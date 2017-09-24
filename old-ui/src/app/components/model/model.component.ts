import {Component, Input} from "@angular/core";
import {PrettyJsonComponent} from 'angular2-prettyjson';

import {SchemaHelper} from "@maxxton/microdocs-core/helpers";
import {Schema} from "@maxxton/microdocs-core/domain";

@Component({
  selector: 'model',
  templateUrl: 'model.component.html',
  styleUrls: ['model.component.scss']
})
export class ModelComponent {

  @Input()
  schema:Schema;

  example:{};

  ngOnChanges() {
    this.example = SchemaHelper.generateExample(this.schema);
  }

  getSubTitle(schema:Schema){
    let tables = "";
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
