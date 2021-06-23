import {Component, Input} from "@angular/core";

import {SchemaHelper} from '@maxxton/microdocs-core/helpers';
import {Schema} from '@maxxton/microdocs-core/domain';

@Component({
  selector: 'body-render',
  templateUrl: 'body-render.component.html',
  styleUrls: ['body-render.component.scss']
})
export class BodyRenderComponent {

  @Input()
  contentTypes: Array<string>;

  @Input()
  schema: Schema;

  @Input()
  mimes: Array<string>;

  @Input()
  schemaList: {[key: string]: Schema};

  example: string;

  ngOnInit() {

  }

  ngOnChanges() {
    this.selectSchema(this.schema);
  }

  selectSchema(schema: Schema): void {
    this.example = SchemaHelper.generateExample(schema, undefined, [], this.schemaList);
  }

}
