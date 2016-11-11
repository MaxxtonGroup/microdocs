import {Component, Input} from "@angular/core";
import {PrettyJsonComponent} from 'angular2-prettyjson/src/prettyjson.component';

import {SchemaHelper} from '@maxxton/microdocs-core/helpers';
import {Schema} from '@maxxton/microdocs-core/domain';
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