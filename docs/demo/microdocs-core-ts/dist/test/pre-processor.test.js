/// <reference path="../../typings/index.d.ts" />
"use strict";
var chai_1 = require('chai');
var pre_processor_1 = require("../helpers/pre-processor/pre-processor");
describe('#MicroDocsPreProcessor: ', function () {
    describe("#process(): ", function () {
        it("Test empty settings", function () {
            var project = {};
            var settings = {};
            var result = pre_processor_1.MicroDocsPreProcessor.process(project, settings);
            chai_1.expect(result).to.deep.eq({});
        });
        it("Test static settings", function () {
            var project = {};
            var settings = { test: true };
            var result = pre_processor_1.MicroDocsPreProcessor.process(project, settings);
            chai_1.expect(result).to.deep.eq({ test: true });
        });
        it("Test static nested settings", function () {
            var project = {};
            var settings = { obj: { test: true } };
            var result = pre_processor_1.MicroDocsPreProcessor.process(project, settings);
            chai_1.expect(result).to.deep.eq({ obj: { test: true } });
        });
        it("Test static merge settings", function () {
            var project = { obj: 'lalala' };
            var settings = { obj: { test: true } };
            var result = pre_processor_1.MicroDocsPreProcessor.process(project, settings);
            chai_1.expect(result).to.deep.eq({ obj: { test: true } });
        });
        it("Test static array", function () {
            var project = { array: [] };
            var settings = { array: ['item', 'item'] };
            var result = pre_processor_1.MicroDocsPreProcessor.process(project, settings);
            chai_1.expect(result).to.deep.eq({ array: ['item', 'item'] });
        });
        it("Test variable injection", function () {
            var project = { myvar: 'helloWorld' };
            var settings = { resolved: '$project.myvar' };
            var result = pre_processor_1.MicroDocsPreProcessor.process(project, settings);
            chai_1.expect(result).to.deep.eq({ myvar: 'helloWorld', resolved: 'helloWorld' });
        });
        it("Test missing variable injection", function () {
            var project = { myvar: 'helloWorld' };
            var settings = { resolved: '$myvar' };
            var result = pre_processor_1.MicroDocsPreProcessor.process(project, settings);
            chai_1.expect(result).to.deep.eq({ myvar: 'helloWorld' });
        });
        it("Test dynamic array", function () {
            var project = { array: [{ name: 'john' }, { name: 'alice' }] };
            var settings = { array: { '{i}': { index: '$i' } } };
            var result = pre_processor_1.MicroDocsPreProcessor.process(project, settings);
            chai_1.expect(result).to.deep.eq({ array: [{ name: 'john', index: 0 }, { name: 'alice', index: 1 }] });
        });
        it("Test dynamic object", function () {
            var project = { object: { "john": { age: 15 }, 'alice': { age: 20 } } };
            var settings = { object: { '{i}': { name: '$i' } } };
            var result = pre_processor_1.MicroDocsPreProcessor.process(project, settings);
            chai_1.expect(result).to.deep.eq({ object: { "john": { age: 15, name: 'john' }, 'alice': { age: 20, name: 'alice' } } });
        });
    });
});
