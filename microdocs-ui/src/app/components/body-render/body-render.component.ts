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
  private contentTypes:string[];
  @Input()
  private schema:Schema;
  @Input()
  private mimes:string[];
  @Input()
  schemaList:{[key:string]:Schema};

  private example:string;

  ngOnInit(){

  }

  ngOnChanges(){
    this.example = SchemaHelper.generateExample(this.schema, undefined, [], this.schemaList);
  }

}
