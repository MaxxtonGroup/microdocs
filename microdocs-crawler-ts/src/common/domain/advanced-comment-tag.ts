
import {Schema} from '@maxxton/microdocs-core/domain';

export interface AdvancedCommentTag{

  tagName: string;
  paramName: string;
  text: string;
  defaultValue?: string;
  type?: string;
  optional?:boolean;

}