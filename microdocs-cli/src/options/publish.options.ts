import { CheckOptions } from "./check.options";

export interface PublishOptions extends CheckOptions{

  version?: string;
  group?: string;
  force?:boolean;

}