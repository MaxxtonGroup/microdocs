
import {Schema} from "../domain/schema/schema.model";
import {Builder} from "./builder";

export class ModelBuilder implements Builder<Schema[]>{

  private _schemas : Schema[] = [];



  build(): Schema[] {
    return this._schemas;
  }

}