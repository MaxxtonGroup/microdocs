/// <reference path="../../typings/index.d.ts" />
"use strict";
var chai_1 = require('chai');
var schema_helper_1 = require("../helpers/schema/schema.helper");
describe('#SchemaHelper: ', function () {
    describe("#resolveString(): ", function () {
        it("test simple string", function () {
            var testString = "hello world";
            var result = schema_helper_1.SchemaHelper.extractStringSegments(testString);
            chai_1.assert.equal(result.length, 1);
            chai_1.expect(result[0].isVar).be.false;
            chai_1.assert.deepEqual(result[0].expression, testString);
        });
        it("test empty string", function () {
            var testString = "";
            var result = schema_helper_1.SchemaHelper.extractStringSegments(testString);
            chai_1.assert.equal(result.length, 0);
        });
        it("test simple var", function () {
            var testString = "hello $name sec";
            var result = schema_helper_1.SchemaHelper.extractStringSegments(testString);
            chai_1.assert.equal(result.length, 3);
            chai_1.expect(result[0].isVar).be.false;
            chai_1.assert.deepEqual(result[0].expression, "hello ");
            chai_1.expect(result[1].isVar).be.true;
            chai_1.assert.deepEqual(result[1].expression, "name");
            chai_1.expect(result[2].isVar).be.false;
            chai_1.assert.deepEqual(result[2].expression, " sec");
        });
        it("test bracket var", function () {
            var testString = "hello ${name test} sec";
            var result = schema_helper_1.SchemaHelper.extractStringSegments(testString);
            chai_1.assert.equal(result.length, 3);
            chai_1.expect(result[0].isVar).be.false;
            chai_1.assert.deepEqual(result[0].expression, "hello ");
            chai_1.expect(result[1].isVar).be.true;
            chai_1.assert.deepEqual(result[1].expression, "name test");
            chai_1.expect(result[2].isVar).be.false;
            chai_1.assert.deepEqual(result[2].expression, " sec");
        });
        it("test pipe", function () {
            var testString = "hello ${name test | number} sec";
            var result = schema_helper_1.SchemaHelper.extractStringSegments(testString);
            chai_1.assert.equal(result.length, 3);
            chai_1.expect(result[0].isVar).be.false;
            chai_1.assert.deepEqual(result[0].expression, "hello ");
            chai_1.expect(result[1].isVar).be.true;
            chai_1.assert.deepEqual(result[1].expression, "name test");
            chai_1.assert.equal(result[1].pipes.length, 1);
            chai_1.assert.deepEqual(result[1].pipes[0], { name: "number" });
            chai_1.expect(result[2].isVar).be.false;
            chai_1.assert.deepEqual(result[2].expression, " sec");
        });
        it("test pipe arg", function () {
            var testString = "hello ${name test | replace test hello} sec";
            var result = schema_helper_1.SchemaHelper.extractStringSegments(testString);
            chai_1.assert.equal(result.length, 3);
            chai_1.expect(result[0].isVar).be.false;
            chai_1.assert.deepEqual(result[0].expression, "hello ");
            chai_1.expect(result[1].isVar).be.true;
            chai_1.assert.deepEqual(result[1].expression, "name test");
            chai_1.assert.equal(result[1].pipes.length, 1);
            chai_1.assert.deepEqual(result[1].pipes[0], { name: "replace", args: ['test', 'hello'] });
            chai_1.expect(result[2].isVar).be.false;
            chai_1.assert.deepEqual(result[2].expression, " sec");
        });
        it("test advanced expression", function () {
            var testString = "hello ${name test | replace test hello} sec $name2|number|json $name3 string ${name4}";
            var result = schema_helper_1.SchemaHelper.extractStringSegments(testString);
            chai_1.assert.equal(result.length, 8);
            chai_1.expect(result[0].isVar).be.false;
            chai_1.assert.deepEqual(result[0].expression, "hello ");
            chai_1.expect(result[1].isVar).be.true;
            chai_1.assert.deepEqual(result[1].expression, "name test");
            chai_1.assert.equal(result[1].pipes.length, 1);
            chai_1.assert.deepEqual(result[1].pipes[0], { name: "replace", args: ['test', 'hello'] });
            chai_1.expect(result[2].isVar).be.false;
            chai_1.assert.deepEqual(result[2].expression, " sec ");
            chai_1.expect(result[3].isVar).be.true;
            chai_1.assert.deepEqual(result[3].expression, "name2");
            chai_1.assert.equal(result[3].pipes.length, 2);
            chai_1.assert.deepEqual(result[3].pipes[0], { name: "number" });
            chai_1.assert.deepEqual(result[3].pipes[1], { name: "json" });
            chai_1.expect(result[4].isVar).be.false;
            chai_1.assert.deepEqual(result[4].expression, " ");
            chai_1.expect(result[5].isVar).be.true;
            chai_1.assert.deepEqual(result[5].expression, "name3");
            chai_1.expect(result[6].isVar).be.false;
            chai_1.assert.deepEqual(result[6].expression, " string ");
            chai_1.expect(result[7].isVar).be.true;
            chai_1.assert.deepEqual(result[7].expression, "name4");
        });
    });
});
