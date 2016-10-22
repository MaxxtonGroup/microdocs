import {Component, Input} from "@angular/core";
import {PrettyJsonComponent} from 'angular2-prettyjson';

import {SchemaHelper} from '@maxxton/microdocs-core-ts/dist/helpers/schema/schema.helper';
import {Schema} from '@maxxton/microdocs-core-ts/dist/domain';
import {FILTERS} from "@maxxton/components/filters";

@Component({
  selector: 'body-render',
  templateUrl: 'body-render.panel.html',
  directives: [PrettyJsonComponent],
  pipes: [FILTERS]
})
export class BodyRenderPanel {

  @Input()
  private contentTypes:string[];
  @Input()
  private schema:Schema;
  @Input()
  private mimes:string[];

  private example:string;

  ngOnInit() {
    this.example = SchemaHelper.generateExample(this.schema);
  }

}