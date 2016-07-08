
import {Component, Input} from "@angular/core";
import {SafeJsonPipe} from 'angular2-prettyjson';

import { SchemaHelper } from 'microdocs-core-ts/dist/helpers/schema/schema.helper';
import { Schema } from 'microdocs-core-ts/dist/domain';
import {NotEmptyPipe} from '../../filters/not-empty.pipe';

@Component({
  selector: 'body-render',
  templateUrl: 'body-render.panel.html',
  pipes: [SafeJsonPipe, NotEmptyPipe]
})
export class BodyRenderPanel{

  @Input()
  private contentTypes:string[];
  @Input()
  private schema:Schema;
  @Input()
  private schemaList:{[key:string]:Schema};

  private example : string;

  ngOnInit(){
    this.example = SchemaHelper.resolve(this.schema, this.schemaList);
    console.info("example:");
    console.info(this.example);
  }

}