import {Component, Input} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {PrettyJsonComponent} from 'angular2-prettyjson';

import {COMPONENTS} from "components-library/dist/components";
import {FILTERS} from "angular-frontend-mxt/dist/filters";
import {SchemaHelper} from "microdocs-core-ts/dist/helpers/schema/schema.helper";
import {Schema} from "microdocs-core-ts/dist/domain";

@Component({
  selector: 'model-panel',
  templateUrl: 'model-panel.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS, FILTERS, PrettyJsonComponent]
})
export class ModelPanel {

  @Input()
  schema:Schema;

  example:{};

  ngOnInit() {
    this.example = SchemaHelper.generateExample(this.schema);
  }

}