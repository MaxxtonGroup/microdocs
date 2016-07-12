
import {Component, Input} from "@angular/core";
import {SafeJsonPipe} from 'angular2-prettyjson';

import { SchemaHelper } from 'microdocs-core-ts/dist/helpers/schema/schema.helper';
import { Schema } from 'microdocs-core-ts/dist/domain';
import {FILTERS} from "angular-frontend-mxt/dist/filters";

@Component({
  selector: 'body-render',
  templateUrl: 'body-render.panel.html',
  pipes: [SafeJsonPipe, FILTERS]
})
export class BodyRenderPanel{

  @Input()
  private contentTypes:string[];
  @Input()
  private schema:Schema;
  @Input()
  private schemaList:{[key:string]:Schema};
  @Input()
  private mimes:string[];

  private example : string;

  ngOnInit(){
    this.example = SchemaHelper.resolve(this.schema, this.schemaList);
  }

}