/// <reference path="../typings/index.d.ts" />
"use strict";
var typedoc_1 = require("typedoc");
var fs = require("fs");
var typedocApplication = new typedoc_1.Application({ ignoreCompilerErrors: true });
var reflect = typedocApplication.convert(['C:\\Users\\hermans.s.MAXXTONBV\\projects\\maxxton-frontend\\services-library\\src\\services\\address.service.ts']);
var filteredReflects = [];
for (var key in reflect.reflections) {
    if (reflect.reflections[key].originalName && reflect.reflections[key].originalName.indexOf('service') != -1) {
        filteredReflects.push(reflect.reflections[key]);
    }
}
fs.writeFileSync("classes2.json", JSON.stringify(reflect, censor(), 4));
function censor() {
    var cache = [];
    return function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    };
}
