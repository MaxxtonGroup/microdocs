
import {Schema} from 'microdocs-core-ts/dist/domain';

export interface AdvancedCommentTag{

  tagName: string;
  paramName: string;
  text: string;
  defaultValue?: any;
  type?: Schema;
  optional?:boolean;

}