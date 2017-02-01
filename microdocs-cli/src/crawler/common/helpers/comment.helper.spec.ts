
import * as helper from './comment.helper';
import {SchemaTypes} from '@maxxton/microdocs-core/domain';
import {CommentTag} from "@maxxton/typedoc/dist/lib/models";
import {assert} from 'chai';

describe('#CommentHelper:', () => {

  describe("#transformCommentTag", () => {

    it('Test string', () => {
      var tagName = 'tag';
      var text = "param Some description";

      var result = helper.transformCommentTag(new CommentTag(tagName, undefined, text));

      assert.equal(tagName, result.tagName);
      assert.equal("param", result.paramName);
      assert.equal("Some description", result.text);
      assert.isNull(result.type);
      assert.isNull(result.defaultValue);
    });

    it('Test type', () => {
      var tagName = 'tag';
      var text = 'param {{prop1:string ,prop2: number} } hello';

      var result = helper.transformCommentTag(new CommentTag(tagName, undefined, text));

      assert.equal(tagName, result.tagName);
      assert.equal("param", result.paramName);
      assert.equal("hello", result.text);
      assert.isNull(result.defaultValue);
      assert.deepEqual("{prop1:string ,prop2: number}", result.type);
    });

    it('Test default value', () => {
      var tagName = 'tag';
      var text = 'param ({prop1: "hello"}) hello';

      var result = helper.transformCommentTag(new CommentTag(tagName, undefined, text));

      assert.equal(tagName, result.tagName);
      assert.equal("param", result.paramName);
      assert.equal("hello", result.text);
      assert.deepEqual("{prop1: \"hello\"}", result.defaultValue);
      assert.isNull(result.type);
    });

    it('Test default value and type', () => {
      var tagName = 'tag';
      var text = 'param {{propr1: string}} ({prop1: "hello"}) hello';

      var result = helper.transformCommentTag(new CommentTag(tagName, undefined, text));

      assert.equal(tagName, result.tagName);
      assert.equal("param", result.paramName);
      assert.equal("hello", result.text);
      assert.deepEqual("{propr1: string}", result.type);
      assert.deepEqual("{prop1: \"hello\"}", result.defaultValue);
    });

    it('Test no param name', () => {
      var tagName = 'tag';
      var text = 'hello world';

      var result = helper.transformCommentTag(new CommentTag(tagName, undefined, text), true);

      assert.equal(tagName, result.tagName);
      assert.isNull(result.paramName);
      assert.equal("hello world", result.text);
    });

  });

});