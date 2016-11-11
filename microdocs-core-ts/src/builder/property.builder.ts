import {Builder} from "./builder";

export class PropertyBuilder implements Builder<Property> {

  public property:Property = new Property();

  build(): Property {
    return this.property;
  }

}

export class Property {
  public name:string;
  public type: string;
  public defaultValue: string;
  public description: string;
  public required: boolean;
}