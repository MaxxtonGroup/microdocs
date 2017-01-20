import { Annotation } from "./annotation.model";
import { Method } from "./method.model";
import { Problemable } from "../problem/problemable.model";

/**
 * @model
 */
export interface Component extends Problemable {

  name?: string;
  file?: string;
  lineNumber?: number;
  type?: string;
  classType?: string;
  description?: string;
  tags?: string[];
  authors?: string[];
  annotations?: { [name: string]: Annotation };
  methods?: { [name: string]: Method };
  dependencies?: Component[];
  $ref?: string;

}