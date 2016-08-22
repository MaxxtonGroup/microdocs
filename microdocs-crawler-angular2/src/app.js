/// <reference path="../typings/index.d.ts" />
"use strict";
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
    fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));
    return;
    /** visit nodes finding exported classes */
    function visit(node) {
        // Only consider exported nodes
        if (node.name == undefined || node.name.kind == undefined) {
            return;
        }
        var symbol = checker.getSymbolAtLocation(node.name);
        if (symbol == undefined) {
            return;
        }
        console.info(symbol.getName());
        if (node.kind == 217 /* ModuleBlock */) {
            // if(symbol['parent'] != undefined){//} && symbol['parent']['SymbolObject'] != undefined && symbol['parent']['SymbolObject']['name'] != undefined){
            // var filename:string = symbol['parent']['SymbolObject']['name'];
            // filename = filename.replace(new RegExp("\"", 'g'), '');
            // if(filename.indexOf('C:/Users/hermans.s.MAXXTONBV/projects/maxxton-frontend/services-library/src') == 0){
            // This is a top level class, get its symbol
            var cache = [];
            // fs.writeFileSync("output/" + symbol.getName() + ".json", JSON.stringify(symbol, function (key, value) {
            //   if (typeof value === 'object' && value !== null) {
            //     if (cache.indexOf(value) !== -1) {
            //       // Circular reference found, discard key
            //       return;
            //     }
            //     // Store value in our collection
            //     cache.push(value);
            //   }
            //   return value;
            // }, 2));
            if (symbol.declarations != undefined && symbol.declarations[0] != undefined && symbol.declarations[0].parent != undefined && symbol.declarations[0].parent.getSourceFile() != undefined) {
                if (symbol.declarations[0].parent.getSourceFile().fileName.indexOf('C:/Users/hermans.s.MAXXTONBV/projects/maxxton-frontend/services-library/src') == 0) {
                    output.push(serializeClass(symbol));
                }
            }
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
        return details;
    }
    /** Serialize a signature (call or construct) */
    function serializeSignature(signature) {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment())
        };
    }
    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node) {
        return (node.flags & 1 /* Export */) !== 0 || (node.parent && node.parent.kind === 246 /* SourceFile */);
    }
}
generateDocumentation(process.argv.slice(2), {
    target: 1 /* ES5 */, module: 1 /* CommonJS */
});
