import {CommentTag} from "typedoc/lib/models";
import {AdvancedCommentTag} from "../domain/advanced-comment-tag";

export function transformCommentTag(tag: CommentTag): AdvancedCommentTag {
  if (tag.text) {
    var paramName: string;
    var text: string;
    var optional = false;
    var slices = tag.text.trim().split(" ");
    if (slices.length > 0) {
      paramName = slices[0];
      if(paramName.indexOf('?') == 0){
        optional = true;
        paramName = paramName.substring(1);
      }
      if (slices.length > 1) {
        for (var i = 1; i < slices.length; i++) {
          if (text) {
            text += ' ' + slices[i];
          } else {
            text = slices[i];
          }
        }
      }
      return <AdvancedCommentTag>{
        tagName: tag.tagName,
        paramName: paramName,
        text: text,
        optional = optional
      };
    }
  }
  return <AdvancedCommentTag>tag;

}