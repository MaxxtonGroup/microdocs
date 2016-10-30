/// <reference path="../../typings/index.d.ts" />

import {expect, assert} from 'chai';
import {SchemaHelper} from "../helpers/schema/schema.helper";
import {Project} from "../domain/project.model";
import {MicroDocsPreProcessor} from "../helpers/pre-processor/pre-processor";

describe('#MicroDocsPreProcessor: ', () => {

  describe("#process(): ", () => {

    it("Test empty settings", () => {
      var project :Project = <Project>{};
      var settings = {};

      var result = MicroDocsPreProcessor.process(project, settings);

      expect(result).to.deep.eq({});
    });

    it("Test static settings", () => {
      var project :Project = <Project>{};
      var settings = {test:true};

      var result = MicroDocsPreProcessor.process(project, settings);

      expect(result).to.deep.eq({test:true});
    });

    it("Test static nested settings", () => {
      var project :Project = <Project>{};
      var settings = {obj:{test:true}};

      var result = MicroDocsPreProcessor.process(project, settings);

      expect(result).to.deep.eq({obj:{test:true}});
    });

    it("Test static merge settings", () => {
      var project :Project = <Project>{obj: 'lalala'};
      var settings = {obj:{test:true}};

      var result = MicroDocsPreProcessor.process(project, settings);

      expect(result).to.deep.eq({obj:{test:true}});
    });

    it("Test static array", () => {
      var project :Project = <Project>{array:[]};
      var settings = {array:['item', 'item']};

      var result = MicroDocsPreProcessor.process(project, settings);

      expect(result).to.deep.eq({array:['item', 'item']});
    });

    it("Test variable injection", () => {
      var project :Project = <Project>{myvar:'helloWorld'};
      var settings = {resolved: '$project.myvar'};

      var result = MicroDocsPreProcessor.process(project, settings);
      expect(result).to.deep.eq({myvar:'helloWorld', resolved: 'helloWorld'});
    });

    it("Test missing variable injection", () => {
      var project :Project = <Project>{myvar:'helloWorld'};
      var settings = {resolved: '$myvar'};

      var result = MicroDocsPreProcessor.process(project, settings);
      expect(result).to.deep.eq({myvar:'helloWorld'});
    });

    it("Test dynamic array", () => {
      var project :Project = <Project>{array:[{name:'john'},{name:'alice'}]};
      var settings = {array:{'{i}': {index: '$i'}}};

      var result = MicroDocsPreProcessor.process(project, settings);
      expect(result).to.deep.eq({array:[{name:'john', index: 0},{name:'alice', index: 1}]});
    });

    it("Test dynamic object", () => {
      var project :Project = <Project>{object:{"john":{age:15},'alice':{age:20}}};
      var settings = {object:{'{i}': {name: '$i'}}};

      var result = MicroDocsPreProcessor.process(project, settings);
      expect(result).to.deep.eq({object:{"john":{age:15,name:'john'},'alice':{age:20, name: 'alice'}}});
    });

  });

});