"use strict";
/// <reference path="../typings/index.d.ts" />
var ts = require("typescript");
var fs = require("fs");
;
/** Generate documention for all classes in a set of .ts files */
function generateDocumentation(fileNames, options) {
    // Build a program using the set of root file names in fileNames
    var program = ts.createProgram(fileNames, options);
    // Get the checker, we will use it to find more about classes
    var checker = program.getTypeChecker();
    var output = [];
    // Visit every sourceFile in the program
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        // Walk the tree to search for classes
        ts.forEachChild(sourceFile, visit);
    }
    // print out the doc
    // console.info(JSON.stringify(output, censor(output), 4));
    fs.writeFileSync("classes.json", JSON.stringify(output, censor(output), 4));
    return;
    /** visit nodes finding exported classes */
    function visit(node) {
        if (node == undefined || node.name == undefined) {
            return;
        }
        var symbol = checker.getSymbolAtLocation(node.name);
        if (symbol == undefined) {
            return;
        }
        if (node.kind === 212 /* ClassDeclaration */ || node.kind === 217 /* ModuleBlock */) {
            // This is a top level class, get its symbol
            output.push(serializeClass(symbol));
            output.push(symbol);
        }
        else if (node.kind === 216 /* ModuleDeclaration */) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        }
    }
    /** Serialize a symbol into a json object */
    function serializeSymbol(symbol) {
        return {
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
        };
    }
    /** Serialize a class symbol infomration */
    function serializeClass(symbol) {
        var details = serializeSymbol(symbol);
        // Get the construct signatures
        var constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        details.constructors = constructorType.getConstructSignatures().map(serializeSignature);
        if (symbol.declarations) {
            symbol.declarations.forEach(function (declaration) {
                if (declaration['members']) {
                    declaration['members'].forEach(function (member) {
                        if (member.nextContainer) {
                            serializeMember(member.nextContainer);
                        }
                    });
                }
            });
        }
        return details;
    }
    function serializeMember(member) {
        if (member.name) {
            console.info(member.name.text + " Found!");
            console.info(JSON.stringify(serializeSignature(member)), undefined, 4);
        }
        if (member.nextContainer) {
            serializeMember(member.nextContainer);
        }
    }
    /** Serialize a signature (call or construct) */
    function serializeSignature(signature) {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment())
        };
    }
}
function censor(censor) {
    var i = 0;
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
var sourcefile = ["test.ts"];
generateDocumentation(sourcefile, {
    target: 1 /* ES5 */, module: 1 /* CommonJS */
});
