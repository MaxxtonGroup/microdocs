
import {Component, Input} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";

import {COMPONENTS} from "angular-frontend-mxt/dist/components";
import {Project, Schema} from "../../../../microdocs-core-ts/src/domain";

@Component({
  selector: 'model-panel',
  templateUrl: 'model-panel.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS]
})
export class ModelPanel{

  @Input()
  schema:Schema;

  @Input()
  project:Project;

}