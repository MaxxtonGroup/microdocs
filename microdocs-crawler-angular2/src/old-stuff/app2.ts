/// <reference path="../../typings/index.d.ts" />

import {Converter} from "typedoc/lib/converter";
import {IConverterResult} from "typedoc/lib/converter/converter";
import {Application} from "typedoc";
import * as fs from "fs";

// input
var sources = [
  'C:\\Users\\hermans.s.MAXXTONBV\\projects\\maxxton-frontend\\services-library\\src\\services\\address.service.ts'
];

// Convert source to refelction
var typedocApplication = new Application({ignoreCompilerErrors: true});
var reflect = typedocApplication.convert(sources);

//start crawling



var filteredReflects = [];
for(var key in reflect.reflections){
  if(reflect.reflections[key].originalName.indexOf('serivce') != -1){
    filteredReflects.push(reflect.reflections[key]);
  }
}

fs.writeFileSync("classes2.json", JSON.stringify(reflect, censor(), 4));


function censor() {
  var cache = [];

  return function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  }
}