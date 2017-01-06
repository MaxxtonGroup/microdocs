/// <reference path="../../../typings/index.d.ts" />

import {expect, assert} from 'chai';
import {SchemaHelper} from "./schema.helper";
import {SchemaTypes} from "../../domain";

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
      assert.deepEqual(result[1].pipes[0], {name: "number"});
      expect(result[2].isVar).be.false;
      assert.deepEqual(result[2].expression, " sec");
    });

    it("test pipe arg", () => {
      var testString = "hello ${name test | replace test hello} sec";

      var result = SchemaHelper.extractStringSegments(testString);

      assert.equal(result.length, 3);
      expect(result[0].isVar).be.false;
      assert.deepEqual(result[0].expression, "hello ");
      expect(result[1].isVar).be.true;
      assert.deepEqual(result[1].expression, "name test");
      assert.equal(result[1].pipes.length, 1);
      assert.deepEqual(result[1].pipes[0], {name: "replace", args: ['test', 'hello']});
      expect(result[2].isVar).be.false;
      assert.deepEqual(result[2].expression, " sec");
    });
  
    it("test advanced expression", () => {
      var testString = "hello ${name test | replace test hello} sec $name2|number|json $name3 string ${name4}";
    
      var result = SchemaHelper.extractStringSegments(testString);

      assert.equal(result.length, 8);
      expect(result[0].isVar).be.false;
      assert.deepEqual(result[0].expression, "hello ");
      
      expect(result[1].isVar).be.true;
      assert.deepEqual(result[1].expression, "name test");
      assert.equal(result[1].pipes.length, 1);
      assert.deepEqual(result[1].pipes[0], {name: "replace", args: ['test', 'hello']});
      
      expect(result[2].isVar).be.false;
      assert.deepEqual(result[2].expression, " sec ");
  
      expect(result[3].isVar).be.true;
      assert.deepEqual(result[3].expression, "name2");
      assert.equal(result[3].pipes.length, 2);
      assert.deepEqual(result[3].pipes[0], {name: "number"});
      assert.deepEqual(result[3].pipes[1], {name: "json"});

      expect(result[4].isVar).be.false;
      assert.deepEqual(result[4].expression, " ");

      expect(result[5].isVar).be.true;
      assert.deepEqual(result[5].expression, "name3");

      expect(result[6].isVar).be.false;
      assert.deepEqual(result[6].expression, " string ");

      expect(result[7].isVar).be.true;
      assert.deepEqual(result[7].expression, "name4");
    });
    
  });
  
  describe("#resolveTypeString(): ", () => {
    
    it("test unknown type", () => {
      var input = "this doesnt exists";
      
      var func = () => SchemaHelper.resolveTypeString(input);
      
      assert.throw(func);
    });
    
    it("test type string", () => {
      var input = "string";
      
      var result = SchemaHelper.resolveTypeString(input);
      
      assert.equal(SchemaTypes.STRING, result.type);
    });
    
    it("test type number", () => {
      var input = "number";
  
      var result = SchemaHelper.resolveTypeString(input);
  
      assert.equal(SchemaTypes.NUMBER, result.type);
    });
  
    it("test type boolean", () => {
      var input = "boolean";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.BOOLEAN, result.type);
    });
  
    it("test type bool", () => {
      var input = "bool";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.BOOLEAN, result.type);
    });
  
    it("test type integer", () => {
      var input = "integer";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.INTEGER, result.type);
    });
  
    it("test type int", () => {
      var input = "int";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.INTEGER, result.type);
    });
  
    it("test type date", () => {
      var input = "date";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.DATE, result.type);
    });
  
    it("test type any", () => {
      var input = "any";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.ANY, result.type);
    });
    
    it("test type array", () => {
      var input = "string[]";
      
      var result = SchemaHelper.resolveTypeString(input);
      
      assert.equal(SchemaTypes.ARRAY, result.type);
      assert.equal(SchemaTypes.STRING, result.items.type);
    });
  
    it("test type array", () => {
      var input = "string[]";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.ARRAY, result.type);
      assert.equal(SchemaTypes.STRING, result.items.type);
    });
  
    it("test type object no props", () => {
      var input = "{}";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.OBJECT, result.type);
      assert.deepEqual({}, result.properties);
    });
  
    it("test type object one props", () => {
      var input = "{test:string}";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.OBJECT, result.type);
      assert.deepEqual({test:{type:SchemaTypes.STRING}}, result.properties);
    });
  
    it("test type object three props", () => {
      var input = "{test:string, test2:number, test3:bool}";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.OBJECT, result.type);
      assert.deepEqual({type:SchemaTypes.STRING}, result.properties['test']);
      assert.deepEqual({type:SchemaTypes.NUMBER}, result.properties['test2']);
      assert.deepEqual({type:SchemaTypes.BOOLEAN}, result.properties['test3']);
    });
  
    it("test type enum", () => {
      var input = "{test, test1, test2}";
    
      var result = SchemaHelper.resolveTypeString(input);
    
      assert.equal(SchemaTypes.ENUM, result.type);
      assert.deepEqual(['test', 'test1', 'test2'], result.enum);
    });
  
    it("test type custom type", () => {
      var input = "Person";
      var handler = (name:string) => {
        return {
          type: SchemaTypes.OBJECT,
          name: 'Person'
        };
      };
    
      var result = SchemaHelper.resolveTypeString(input, handler);
    
      assert.equal(SchemaTypes.OBJECT, result.type);
      assert.equal('Person', result.name);
    });

    it("test generic type", () => {
      var input = "Array<string>";

      var result = SchemaHelper.resolveTypeString(input);

      assert.equal(SchemaTypes.ARRAY, result.type);
      assert.equal(SchemaTypes.STRING, result.items.type);
    });

    it("test multi generic type", () => {
      var input = "Map<string, int>";

      var result = SchemaHelper.resolveTypeString(input);

      assert.equal(SchemaTypes.OBJECT, result.type);
      assert.equal(SchemaTypes.INTEGER, result.additonalProperties.type);
    });

    it("test additional property", () => {
      var input = "{[key:string]:Component}";

      var result = SchemaHelper.resolveTypeString(input, ( modelName, genericTypes ) => {
        assert.equal('Component', modelName);
        return {
          $ref: '#/definitions/' + modelName
        };
      });

      assert.equal(SchemaTypes.OBJECT, result.type);
      assert.equal('#/definitions/Component', result.additonalProperties.$ref);
    });
    
  });

  describe("#resolveCondition(): ", () => {

    it("Test true condition", () => {
      let vars = {
        scope: {value:5},
        project: {},
        settings: {},
        settingsScope: {}
      };


      let result = SchemaHelper.resolveCondition("scope.value == 5", vars);

      assert.isTrue(result);
    });

  });

  describe("#resolveCondition(): ", () => {

    it("Test false condition", () => {
      let vars = {
        scope: {value:5},
        project: {},
        settings: {},
        settingsScope: {}
      };


      let result = SchemaHelper.resolveCondition("scope.value > 5", vars);

      assert.isFalse(result);
    });

  });

});
