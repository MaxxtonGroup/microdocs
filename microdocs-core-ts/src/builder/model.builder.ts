
import {Schema, SchemaTypes} from "../domain";
import {Builder} from "./builder";

export class ModelBuilder implements Builder<Schema>{

  private _schema : Schema = {
    type: SchemaTypes.OBJECT,
    properties: {}
  };

  constructor(name:string){
    this._schema.name = name;
  }

  public schema():Schema{
    return this._schema;
  }

  build(): Schema {
    return this._schema;
  }

}