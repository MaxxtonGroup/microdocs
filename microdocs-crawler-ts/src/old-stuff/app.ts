/// <reference path="../../typings/index.d.ts" />
import * as ts from "typescript";
import * as fs from "fs";
import Declaration = ts.Declaration;

interface DocEntry {
  name?: string,
  fileName?: string,
  documentation?: string,
  type?: string,
  constructors?: DocEntry[],
  parameters?: DocEntry[],
  returnType?: string
};

/** Generate documention for all classes in a set of .ts files */
function generateDocumentation(fileNames: string[], options: ts.CompilerOptions): void {
  // Build a program using the set of root file names in fileNames
  let program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();

  let output: DocEntry[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    // Walk the tree to search for classes
    ts.forEachChild(sourceFile, visit);
  }

  // print out the doc
  // console.info(JSON.stringify(output, censor(output), 4));
  fs.writeFileSync("classes.json", JSON.stringify(output, censor(output), 4));

  return;

  /** visit nodes finding exported classes */
  function visit(node: ts.Node) {
    if(node == undefined || (<ts.ClassDeclaration>node).name == undefined){
      return;
    }
    let symbol = checker.getSymbolAtLocation((<ts.ClassDeclaration>node).name);
    if(symbol == undefined){
      return;
    }
    if (node.kind === ts.SyntaxKind.ClassDeclaration || node.kind === ts.SyntaxKind.ModuleBlock) {
      // This is a top level class, get its symbol
      output.push(serializeClass(symbol));
      output.push(symbol);
      // No need to walk any further, class expressions/inner declarations
      // cannot be exported
    }
    else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
      // This is a namespace, visit its children
      ts.forEachChild(node, visit);
    }
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol): DocEntry {
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
    };
  }

  /** Serialize a class symbol infomration */
  function serializeClass(symbol: ts.Symbol) {
    let details = serializeSymbol(symbol);

    // Get the construct signatures
    let constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
    details.constructors = constructorType.getConstructSignatures().map(serializeSignature);

    if(symbol.declarations){
      symbol.declarations.forEach(declaration => {
        if(declaration['members']){
          declaration['members'].forEach(member => {
            if(member.nextContainer) {
              serializeMember(member.nextContainer);
            }
          });
        }
      });
    }
    return details;
  }

  function serializeMember(member:any){
    if(member.name){
      console.info(member.name.text + " Found!");
    }

    if(member.nextContainer) {
      serializeMember(member.nextContainer);
    }
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: ts.Signature) {
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


var sourcefile = ["test.ts"];

generateDocumentation(sourcefile, {
  target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});