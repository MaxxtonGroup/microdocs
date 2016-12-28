import {CommentTag} from "typedoc/dist/lib/models";
import {AdvancedCommentTag} from "../domain/advanced-comment-tag";

export function transformCommentTag(tag: CommentTag, ignoreParamName: boolean = false): AdvancedCommentTag {
  if (tag.text) {
    var paramName: string = null;
    var text: string;
    var optional = false;
    var type: string = null;
    var defaultValue: string = null;

    var slices = tag.text.trim().split(" ");
    if (slices.length > 0 && !ignoreParamName) {
      paramName = slices.shift();
      if (paramName.indexOf('?') == 0) {
        optional = true;
        paramName = paramName.substring(1);
      }
    }


    if (slices.length > 0) {
      let inTypeDepth = 0;
      let inDefaultDepth = 0;
      for (var i = 0; i < slices.length; i++) {
        var word = slices[i];
        if (inTypeDepth > 0) {
          type += ' ';
          for (let i = 0; i < word.length; i++) {
            let char = word.charAt(i);
            if (char === '}') {
              inTypeDepth--;
              if (inTypeDepth == 0) {
                type = type.trim();
                break;
              }
            }
            type += char;
            if (char == '{') {
              inTypeDepth++;
            }
          }
        } else if (inDefaultDepth > 0) {
          defaultValue += ' ';
          for (let i = 0; i < word.length; i++) {
            let char = word.charAt(i);
            if (char === ')') {
              inDefaultDepth--;
              if (inDefaultDepth == 0) {
                defaultValue = defaultValue.trim();
                break;
              }
            }
            defaultValue += char;
            if (char == '(') {
              inDefaultDepth++;
            }
          }
        } else if (word.indexOf('{') == 0 && type == null) {
          inTypeDepth++;
          type = '';
          for (let i = 1; i < word.length; i++) {
            let char = word.charAt(i);
            if (char === '}') {
              inTypeDepth--;
              if (inTypeDepth == 0) {
                break;
              }
            }
            type += char;
            if (char == '{') {
              inTypeDepth++;
            }
          }
        } else if (word.indexOf('(') == 0 && defaultValue == null) {
          inDefaultDepth++;
          defaultValue = '';
          for (let i = 1; i < word.length; i++) {
            let char = word.charAt(i);
            if (char === ')') {
              inDefaultDepth--;
              if (inDefaultDepth == 0) {
                break;
              }
            }
            defaultValue += char;
            if (char == '(') {
              inDefaultDepth++;
            }
          }
        } else if (text) {
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
      optional: optional,
      type: type,
      defaultValue: defaultValue
    };
  }
  return <AdvancedCommentTag>tag;

}