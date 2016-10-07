/**
 * Created by Reinartz.T on 21-7-2016.
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getValueFromFieldAndData(data, field) {
        if (data && field) {
            if (field.indexOf('.') == -1) {
                return data[field];
            }
            else {
                var fields = field.split('.');
                var value = data;
                for (var i = 0; i < fields.length; i++) {
                    if (value != undefined)
                        value = value[fields[i]];
                }
                if (typeof value === "function") {
                    return value();
                }
                else
                    return value;
            }
        }
        return null;
    }
    exports_1("getValueFromFieldAndData", getValueFromFieldAndData);
    return {
        setters:[],
        execute: function() {
        }
    }
});
