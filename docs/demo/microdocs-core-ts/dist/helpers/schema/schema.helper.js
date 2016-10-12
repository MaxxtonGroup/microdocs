"use strict";
var schema_type_model_1 = require("../../domain/schema/schema-type.model");
/**
 * Helper class for generation example data based on schema and resolve references
 */
var SchemaHelper = (function () {
    function SchemaHelper() {
    }
    /**
     * Resolve schema and return an example object
     * @param schema
     * @param fieldName
     * @return example object
     */
    SchemaHelper.generateExample = function (schema, fieldName, objectStack, rootObject) {
        if (objectStack === void 0) { objectStack = []; }
        if (schema != undefined && schema != null) {
            if (schema.type == schema_type_model_1.OBJECT) {
                if (schema.name != undefined && schema.name != null) {
                    var sameObjects = objectStack.filter(function (object) { return object == schema.name; });
                    if (sameObjects.length > 0) {
                        return '[' + schema.name + ']';
                    }
                    objectStack.push(schema.name);
                }
            }
            schema = SchemaHelper.collect(schema, objectStack, rootObject);
            if (schema.default != undefined) {
                return schema.default;
            }
            if (schema.type == schema_type_model_1.ENUM && schema.enum != undefined && schema.enum != null) {
                if (schema.enum.length == 0) {
                    return "[" + schema.name + "]";
                }
                var random = Math.floor((Math.random() * schema.enum.length));
                return schema.enum[random];
            }
            else if (schema.type == schema_type_model_1.BOOLEAN) {
                var random = Math.floor((Math.random() * 2));
                return random == 1;
            }
            else if (schema.type == schema_type_model_1.INTEGER) {
                var random = Math.floor((Math.random() * 99) + 1);
                return random;
            }
            else if (schema.type == schema_type_model_1.NUMBER) {
                var random = (Math.random() * 99) + 1;
                return random;
            }
            else if (schema.type == schema_type_model_1.STRING) {
                return "Extended kindness trifling";
            }
            else if (schema.type == schema_type_model_1.ARRAY) {
                var array = [];
                array.push(SchemaHelper.generateExample(schema.items, undefined, objectStack, rootObject));
                return array;
            }
            else if (schema.type == schema_type_model_1.OBJECT) {
                var object = {};
                if (schema.allOf != undefined) {
                    schema.allOf.forEach(function (superSchema) {
                        if (superSchema.type == schema_type_model_1.OBJECT) {
                            var superObject = SchemaHelper.generateExample(superSchema, fieldName, objectStack.slice(), rootObject);
                            for (var field in superObject) {
                                object[field] = superObject[field];
                            }
                        }
                    });
                }
                for (var field in schema.properties) {
                    var property = schema.properties[field];
                    var name = field;
                    var jsonName = SchemaHelper.resolveReference('mappings.json.name', property);
                    var jsonIgnore = SchemaHelper.resolveReference('mappings.json.ignore', property);
                    if (jsonIgnore != true) {
                        if (jsonName != null) {
                            name = jsonName;
                        }
                        object[name] = SchemaHelper.generateExample(property, name, objectStack.slice(), rootObject);
                    }
                }
                return object;
            }
        }
        return null;
    };
    SchemaHelper.collect = function (schema, objectStack, rootObject) {
        if (objectStack === void 0) { objectStack = []; }
        if (schema == undefined || schema == null) {
            return schema;
        }
        if (schema.$ref != undefined) {
            var result = SchemaHelper.resolveReference(schema.$ref, rootObject);
            if (result != null) {
                schema = result;
            }
        }
        if (schema.type == schema_type_model_1.OBJECT) {
            if (schema.name != undefined && schema.name != null) {
                var sameObjects = objectStack.filter(function (object) { return object == schema.name; });
                if (sameObjects.length > 0) {
                    return schema;
                }
                objectStack.push(schema.name);
            }
            var fullSchema = schema;
            if (schema.allOf != undefined && schema.allOf != null) {
                schema.allOf.forEach(function (superSchema) {
                    if (superSchema != undefined && superSchema != null && superSchema.properties != null && superSchema.properties != undefined) {
                        for (var key in superSchema.properties) {
                            //todo: combine instead of override
                            fullSchema.properties[key] = SchemaHelper.collect(superSchema.properties[key], objectStack, rootObject);
                        }
                    }
                });
            }
            if (schema.properties != undefined && schema.properties != null) {
                for (var key in schema.properties) {
                    //todo: combine instead of override
                    fullSchema.properties[key] = SchemaHelper.collect(schema.properties[key], objectStack, rootObject);
                }
            }
            return fullSchema;
        }
        else {
            return schema;
        }
    };
    /**
     * Search for the reference in the object
     * @param reference href (eg. #/foo/bar) or path (eg. foo.bar)
     * @param vars object where to search in
     * @returns {any} object or null
     */
    SchemaHelper.resolveReference = function (reference, vars) {
        if (reference != undefined || reference == null) {
            var currentObject = vars;
            var segments = [];
            if (reference.indexOf("#/") == 0) {
                // href
                segments = reference.substring(2).split("/");
            }
            else {
                // path
                segments = reference.split(".");
            }
            segments.forEach(function (segment) {
                if (currentObject != undefined && currentObject != null) {
                    var resolvedName = segment;
                    if (segment.indexOf('[') == 0 && segment.indexOf(']') == segment.length - 1) {
                        var segmentName = segment.substring(1, segment.length - 1);
                        resolvedName = SchemaHelper.resolveString('${' + segmentName + '}', vars);
                    }
                    currentObject = currentObject[resolvedName];
                }
            });
            if (currentObject == undefined) {
                currentObject = null;
            }
            return currentObject;
        }
        return null;
    };
    /**
     * Extract expressions from string
     * examples:
     *    "hello $name"
     *        -> [{isVar: false, expression: "hello "},{isVar: true, expression: "name"}]
     *    "hello ${name}"
     *        -> [{isVar: false, expression: "hello "},{isVar: true, expression: "name"}]
     *    "${someIndex|number}"
     *        -> [{isVar: true, expression: "someIndex", pipes:["number"]}]
     * @param string
     * @return {{isVar: boolean, expression: string, pipes?: string[]}[]}
     */
    SchemaHelper.extractStringSegments = function (string) {
        var isEscaped = false;
        var isVar = false;
        var isBrackets = false;
        var isPipe = false;
        var segments = [];
        var currentSegment = null;
        for (var i = 0; i < string.length; i++) {
            var char = string.charAt(i);
            if (isEscaped) {
                isEscaped = false;
                if (isPipe) {
                    if (currentSegment.pipes && currentSegment.pipes.length > 0) {
                        var currentPipe = currentSegment.pipes[currentSegment.pipes.length - 1];
                        if (currentPipe.args && currentPipe.args.length > 0) {
                            currentPipe.args[currentPipe.args.length - 1] += char;
                        }
                        else {
                            currentPipe.name = currentPipe.name + char;
                        }
                    }
                    else {
                        currentSegment.pipes = [{ name: char }];
                    }
                }
                else {
                    if (!currentSegment) {
                        currentSegment = { isVar: isVar, expression: "" };
                    }
                    currentSegment.expression += char;
                }
            }
            else if (char === "\\") {
                isEscaped = true;
            }
            else if (isVar) {
                if ((!currentSegment || currentSegment.expression === '') && char === '{') {
                    isBrackets = true;
                }
                else if (isBrackets && char === '}') {
                    isVar = false;
                    isPipe = false;
                    isBrackets = false;
                    if (currentSegment) {
                        if (currentSegment.isVar) {
                            currentSegment.expression = currentSegment.expression.trim();
                            if (currentSegment.pipes) {
                                var newPipes = [];
                                currentSegment.pipes.forEach((function (pipe) {
                                    newPipes.push(pipe);
                                }));
                                currentSegment.pipes = newPipes;
                            }
                        }
                        segments.push(currentSegment);
                    }
                    currentSegment = null;
                }
                else if (!isBrackets && char === ' ') {
                    isVar = false;
                    isPipe = false;
                    if (currentSegment) {
                        if (currentSegment.isVar) {
                            currentSegment.expression = currentSegment.expression.trim();
                            if (currentSegment.pipes) {
                                var newPipes = [];
                                currentSegment.pipes.forEach(function (pipe) {
                                    newPipes.push(pipe);
                                });
                                currentSegment.pipes = newPipes;
                            }
                        }
                        segments.push(currentSegment);
                    }
                    currentSegment = { isVar: false, expression: " " };
                }
                else if (currentSegment && char === '|') {
                    isPipe = true;
                    if (!currentSegment.pipes || currentSegment.pipes.length == 0) {
                        currentSegment.pipes = [{ name: '' }];
                    }
                    else {
                        currentSegment.pipes.push({ name: '' });
                    }
                }
                else if (currentSegment && isPipe) {
                    if (currentSegment.pipes && currentSegment.pipes.length > 0) {
                        var currentPipe = currentSegment.pipes[currentSegment.pipes.length - 1];
                        if (char === ' ' && currentPipe.name !== '') {
                            if (!currentPipe.args) {
                                currentPipe.args = [''];
                            }
                            else {
                                currentPipe.args.push('');
                            }
                        }
                        else if (char !== ' ') {
                            if (currentPipe.args && currentPipe.args.length > 0) {
                                currentPipe.args[currentPipe.args.length - 1] += char;
                            }
                            else {
                                currentPipe.name = currentPipe.name + char;
                            }
                        }
                    }
                    else {
                        currentSegment.pipes = [{ name: char }];
                    }
                }
                else {
                    if (!currentSegment) {
                        currentSegment = { isVar: isVar, expression: "" };
                    }
                    currentSegment.expression += char;
                }
            }
            else if (char === "$") {
                isVar = true;
                if (currentSegment) {
                    if (currentSegment.isVar) {
                        currentSegment.expression = currentSegment.expression.trim();
                        if (currentSegment.pipes) {
                            var newPipes = [];
                            currentSegment.pipes.forEach(function (pipe) {
                                newPipes.push(pipe);
                            });
                            currentSegment.pipes = newPipes;
                        }
                    }
                    segments.push(currentSegment);
                }
                currentSegment = null;
            }
            else {
                if (!currentSegment) {
                    currentSegment = { isVar: false, expression: "" };
                }
                currentSegment.expression += char;
            }
        }
        if (currentSegment) {
            if (currentSegment.isVar) {
                currentSegment.expression = currentSegment.expression.trim();
                if (currentSegment.pipes) {
                    var newPipes = [];
                    currentSegment.pipes.forEach(function (pipe) {
                        newPipes.push(pipe);
                    });
                    currentSegment.pipes = newPipes;
                }
            }
            segments.push(currentSegment);
        }
        return segments;
    };
    /**
     * Resolve string which contains references (eg. "hello ${foo.bar}")
     * @param string string to be resolved
     * @param object object where to search in
     * @returns {string} resolved string
     */
    SchemaHelper.resolveString = function (string, vars) {
        var result;
        var segments = SchemaHelper.extractStringSegments(string);
        segments.forEach(function (segment) {
            if (segment.isVar) {
                var resolvedObject = SchemaHelper.resolveReference(segment.expression.trim(), vars);
                if (resolvedObject != undefined) {
                    if (segment.pipes) {
                        segment.pipes.forEach(function (pipe) {
                            if (pipe.name.trim() === 'integer' || pipe.name.trim() === 'int') {
                                resolvedObject = parseInt(resolvedObject);
                            }
                            else if (pipe.name.trim() === 'number' || pipe.name.trim() === 'float' || pipe.name.trim() === 'double') {
                                resolvedObject = parseFloat(resolvedObject);
                            }
                            else if (pipe.name.trim() === 'boolean') {
                                resolvedObject = Boolean(resolvedObject);
                            }
                            else if (pipe.name.trim() === 'string') {
                                resolvedObject = new String(resolvedObject);
                            }
                            else if (pipe.name.trim() === 'json') {
                                resolvedObject = JSON.stringify(resolvedObject);
                            }
                            else if (pipe.name.trim() === 'uc') {
                                resolvedObject = resolvedObject.toUpperCase();
                            }
                            else if (pipe.name.trim() === 'lc') {
                                resolvedObject = resolvedObject.toLowerCase();
                            }
                            else if (pipe.name.trim() === 'replace') {
                                if (pipe.args.length >= 2) {
                                    console.error("replace: '" + resolvedObject + "' " + pipe.args[0] + " - " + pipe.args[1]);
                                    resolvedObject = resolvedObject.replace(new RegExp(pipe.args[0], 'g'), pipe.args[1]);
                                    console.error("result: " + resolvedObject);
                                }
                                else {
                                    console.warn("Pipe replace requires 2 arguments ");
                                }
                            }
                            else {
                                console.warn("Unknown pipe: " + pipe);
                            }
                        });
                    }
                    if (result) {
                        result += resolvedObject;
                    }
                    else {
                        result = resolvedObject;
                    }
                }
            }
            else {
                if (result) {
                    result += segment.expression;
                }
                else {
                    result = segment.expression;
                }
            }
        });
        return result;
    };
    /**
     * Resolve references in a object
     * @param object
     * @param rootObject
     * @returns {{}}
     */
    SchemaHelper.resolveObject = function (object, rootObject) {
        if (object != null && object != undefined) {
            if (rootObject == undefined) {
                rootObject = object;
            }
            for (var key in object) {
                var childObject = object[key];
                if (typeof (childObject) == schema_type_model_1.OBJECT) {
                    SchemaHelper.resolveObject(childObject, rootObject);
                }
                else if (typeof (childObject) == schema_type_model_1.STRING && key != '$ref') {
                    object[key] = SchemaHelper.resolveString(childObject, rootObject);
                }
            }
            if (object['$ref'] != undefined) {
                var refObject = SchemaHelper.resolveReference(object['$ref'], rootObject);
                if (refObject != null) {
                    for (var key in refObject) {
                        if (object[key] == undefined) {
                            object[key] = refObject[key];
                        }
                    }
                }
                delete object['$ref'];
            }
        }
        return object;
    };
    return SchemaHelper;
}());
exports.SchemaHelper = SchemaHelper;
