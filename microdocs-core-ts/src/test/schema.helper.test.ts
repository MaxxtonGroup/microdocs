/// <reference path="../../typings/index.d.ts" />

import {expect, assert} from 'chai';
import {SchemaHelper} from "../helpers/schema/schema.helper";

describe('#SchemaHelper: ', () => {
  
  describe("#resolveString(): ", () => {
    
    it("test simple string", () => {
      var testString = "hello world";
      
      var result = SchemaHelper.extractStringSegments(testString);
  
      assert.equal(result.length, 1);
      expect(result[0].isVar).be.false;
      assert.deepEqual(result[0].expression, testString);
    });
  
    it("test empty string", () => {
      var testString = "";
    
      var result = SchemaHelper.extractStringSegments(testString);
    
      assert.equal(result.length, 0);
    });
    
    it("test simple var", () => {
      var testString = "hello $name sec";
  
      var result = SchemaHelper.extractStringSegments(testString);
  
      assert.equal(result.length, 3);
      expect(result[0].isVar).be.false;
      assert.deepEqual(result[0].expression, "hello ");
      expect(result[1].isVar).be.true;
      assert.deepEqual(result[1].expression, "name");
      expect(result[2].isVar).be.false;
      assert.deepEqual(result[2].expression, " sec");
    });
  
    it("test bracket var", () => {
      var testString = "hello ${name test} sec";
    
      var result = SchemaHelper.extractStringSegments(testString);
    
      assert.equal(result.length, 3);
      expect(result[0].isVar).be.false;
      assert.deepEqual(result[0].expression, "hello ");
      expect(result[1].isVar).be.true;
      assert.deepEqual(result[1].expression, "name test");
      expect(result[2].isVar).be.false;
      assert.deepEqual(result[2].expression, " sec");
    });
  
    it("test pipe", () => {
      var testString = "hello ${name test | number} sec";
    
      var result = SchemaHelper.extractStringSegments(testString);
    
      assert.equal(result.length, 3);
      expect(result[0].isVar).be.false;
      assert.deepEqual(result[0].expression, "hello ");
      expect(result[1].isVar).be.true;
      assert.deepEqual(result[1].expression, "name test");
      assert.equal(result[1].pipes.length, 1);
      assert.deepEqual(result[1].pipes[0], "number");
      expect(result[2].isVar).be.false;
      assert.deepEqual(result[2].expression, " sec");
    });
  
    it("test advanced expression", () => {
      var testString = "hello ${name test | number} sec $name2|number|json $name3 string ${name4}";
    
      var result = SchemaHelper.extractStringSegments(testString);
    
      assert.equal(result.length, 7);
      expect(result[0].isVar).be.false;
      assert.deepEqual(result[0].expression, "hello ");
      
      expect(result[1].isVar).be.true;
      assert.deepEqual(result[1].expression, "name test");
      assert.equal(result[1].pipes.length, 1);
      assert.deepEqual(result[1].pipes[0], "number");
      
      expect(result[2].isVar).be.false;
      assert.deepEqual(result[2].expression, " sec");
  
      expect(result[3].isVar).be.true;
      assert.deepEqual(result[3].expression, "name2");
      assert.equal(result[3].pipes.length, 2);
      assert.deepEqual(result[3].pipes[0], "number");
      assert.deepEqual(result[3].pipes[0], "json");
    });
    
  });
  
});
