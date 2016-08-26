import {Schema} from "../../domain";
import {OBJECT, ARRAY, BOOLEAN, ENUM, INTEGER, NUMBER, STRING} from "../../domain/schema/schema-type.model";
import {evalExpression} from "@angular/compiler/esm/src/facade/lang";

/**
 * Helper class for generation example data based on schema and resolve references
 */
export class SchemaHelper {
  
  /**
   * Resolve schema and return an example object
   * @param schema
   * @param fieldName
   * @return example object
   */
  public static generateExample(schema:Schema, fieldName?:string, objectStack:string[] = [], rootObject?:{}):any {
    if (schema != undefined && schema != null) {
      if (schema.type == OBJECT) {
        if (schema.name != undefined && schema.name != null) {
          var sameObjects:string[] = objectStack.filter((object) => object == schema.name);
          // console.info('has equals: ' + sameObjects.length + " - " + schema.name);
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
      if (schema.type == ENUM && schema.enum != undefined && schema.enum != null) {
        var random = Math.floor((Math.random() * schema.enum.length));
        return schema.enum[random];
      } else if (schema.type == BOOLEAN) {
        var random = Math.floor((Math.random() * 2));
        return random == 1;
      } else if (schema.type == INTEGER) {
        var random = Math.floor((Math.random() * 99) + 1);
        return random;
      } else if (schema.type == NUMBER) {
        var random = (Math.random() * 99) + 1;
        return random;
      } else if (schema.type == STRING) {
        return "Extended kindness trifling";
      } else if (schema.type == ARRAY) {
        var array:Array<any> = [];
        array.push(SchemaHelper.generateExample(schema.items, undefined, objectStack, rootObject));
        return array;
      } else if (schema.type == OBJECT) {
        var object:{} = {};
        if (schema.allOf != undefined) {
          schema.allOf.forEach(superSchema => {
            if (superSchema.type == OBJECT) {
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
  }
  
  public static collect(schema:Schema, objectStack:string[] = [], rootObject?:{}):Schema {
    if (schema == undefined || schema == null) {
      return schema;
    }
    if (schema.$ref != undefined) {
      var result = SchemaHelper.resolveReference(schema.$ref, rootObject);
      if (result != null) {
        schema = result;
      }
    }
    if (schema.type == OBJECT) {
      if (schema.name != undefined && schema.name != null) {
        var sameObjects:string[] = objectStack.filter((object) => object == schema.name);
        // console.info('has equals: ' + sameObjects.length + " - " + schema.name);
        if (sameObjects.length > 0) {
          return schema;
        }
        objectStack.push(schema.name);
      }
      var fullSchema = schema;
      if (schema.allOf != undefined && schema.allOf != null) {
        schema.allOf.forEach(superSchema => {
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
    } else {
      return schema;
    }
  }
  
  /**
   * Search for the reference in the object
   * @param reference href (eg. #/foo/bar) or path (eg. foo.bar)
   * @param object object where to search in
   * @returns {any} object or null
   */
  public static resolveReference(reference:string, object:{}):any {
    if (reference != undefined || reference == null) {
      var currentObject = object;
      var segments:string[] = [];
      if (reference.indexOf("#/") == 0) {
        // href
        segments = reference.substring(2).split("/");
      } else {
        // path
        segments = reference.split(".");
      }
      segments.forEach((segment) => {
        if (currentObject != undefined && currentObject != null) {
          currentObject = currentObject[segment];
        }
      });
      if (currentObject == undefined) {
        currentObject = null;
      }
      return currentObject;
    }
    return null;
  }
  
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
  public static extractStringSegments(string:string):{isVar:boolean,expression:string, pipes?:string[]}[] {
    var isEscaped = false;
    var isVar = false;
    var isBrackets = false;
    var isPipe = false;
    
    var segments:{isVar:boolean,expression:string, pipes?:string[]}[] = [];
    var currentSegment:{isVar:boolean,expression:string, pipes?:string[]} = null;
    for (var i = 0; i < string.length; i++) {
      var char = string.charAt(i);
      if (isEscaped) {
        isEscaped = false;
        if (isPipe) {
          if (currentSegment.pipes && currentSegment.pipes.length > 1) {
            currentSegment.pipes[currentSegment.pipes.length - 1] += char;
          } else {
            currentSegment.pipes = [char];
          }
        } else {
          if (!currentSegment) {
            currentSegment = {isVar: isVar, expression: ""};
          }
          currentSegment.expression += char;
        }
      } else if (char === "\\") {
        isEscaped = true;
      } else if (isVar) {
        if ((!currentSegment || currentSegment.expression === '') && char === '{') {
          isBrackets = true;
        } else if (isBrackets && char === '}') {
          isVar = false;
          isPipe = false;
          if(currentSegment) {
            if(currentSegment.isVar){
              currentSegment.expression = currentSegment.expression.trim();
              if(currentSegment.pipes){
                var newPipes:string[] = [];
                currentSegment.pipes.forEach((pipe => {
                  newPipes.push(pipe.trim());
                }));
                currentSegment.pipes = newPipes;
              }
            }
            segments.push(currentSegment);
          }
          currentSegment = null;
        } else if (!isBrackets && char === ' ') {
          isVar = false;
          isPipe = false;
          if(currentSegment) {
            if(currentSegment.isVar){
              currentSegment.expression = currentSegment.expression.trim();
              if(currentSegment.pipes){
                var newPipes:string[] = [];
                currentSegment.pipes.forEach((pipe => {
                  newPipes.push(pipe.trim());
                }));
                currentSegment.pipes = newPipes;
              }
            }
            segments.push(currentSegment);
          }
          currentSegment = {isVar: false, expression: " "};
        } else if (currentSegment && char === '|') {
          isPipe = true;
          if (!currentSegment.pipes || currentSegment.pipes.length == 0) {
            currentSegment.pipes = [''];
          }
        } else if (currentSegment && isPipe) {
          if (currentSegment.pipes && currentSegment.pipes.length > 0) {
            currentSegment.pipes[currentSegment.pipes.length - 1] = currentSegment.pipes[currentSegment.pipes.length - 1] + char;
          } else {
            currentSegment.pipes = [char];
          }
        } else {
          if (!currentSegment) {
            currentSegment = {isVar: isVar, expression: ""};
          }
          currentSegment.expression += char;
        }
      } else if (char === "$") {
        isVar = true;
        if (currentSegment) {
          if(currentSegment.isVar){
            currentSegment.expression = currentSegment.expression.trim();
            if(currentSegment.pipes){
              var newPipes:string[] = [];
              currentSegment.pipes.forEach((pipe => {
                newPipes.push(pipe.trim());
              }));
              currentSegment.pipes = newPipes;
            }
          }
          segments.push(currentSegment);
        }
        currentSegment = null;
      } else {
        if (!currentSegment) {
          currentSegment = {isVar: false, expression: ""};
        }
        currentSegment.expression += char;
      }
    }
    if (currentSegment) {
      if(currentSegment.isVar){
        currentSegment.expression = currentSegment.expression.trim();
        if(currentSegment.pipes){
          var newPipes:string[] = [];
          currentSegment.pipes.forEach((pipe => {
            newPipes.push(pipe.trim());
          }));
          currentSegment.pipes = newPipes;
        }
      }
      segments.push(currentSegment);
    }
    return segments;
  }
  
  /**
   * Resolve string which contains references (eg. "hello {foo.bar}")
   * @param string string to be resolved
   * @param object object where to search in
   * @returns {string} resolved string
   */
  public static resolveString(string:string, vars:{}):any {
    var result:any;
    var segments = SchemaHelper.extractStringSegments(string);
    segments.forEach(segment => {
      if (segment.isVar) {
        var resolvedObject = SchemaHelper.resolveReference(segment.expression.trim(), vars);
        if (resolvedObject) {
          if (segment.pipes) {
            segment.pipes.forEach(pipe => {
                if (pipe.trim() === 'integer' || pipe.trim() === 'int') {
                  resolvedObject = parseInt(resolvedObject);
                } else if (pipe.trim() === 'number' || pipe.trim() === 'float' || pipe.trim() === 'double') {
                  resolvedObject = parseFloat(resolvedObject);
                } else if (pipe.trim() === 'boolean') {
                  resolvedObject = Boolean(resolvedObject);
                } else if (pipe.trim() === 'string') {
                  resolvedObject = new String(resolvedObject);
                } else if (pipe.trim() === 'json') {
                  resolvedObject = JSON.stringify(resolvedObject);
                } else {
                  console.warn("Unknown pipe: " + pipe);
                }
              }
            );
          }
          if (result) {
            result += resolvedObject;
          } else {
            result = resolvedObject;
          }
        }
      } else {
        if (result) {
          result += segment.expression;
        } else {
          result = segment.expression;
        }
      }
    });
    return result;
  }
  
  /**
   * Resolve references in a object
   * @param object
   * @param rootObject
   * @returns {{}}
   */
  public static resolveObject(object:{}, rootObject ?:{}):{} {
    if (object != null && object != undefined) {
      if (rootObject == undefined) {
        rootObject = object;
      }
      for (var key in object) {
        var childObject = object[key];
        if (typeof(childObject) == OBJECT) {
          SchemaHelper.resolveObject(childObject, rootObject);
        } else if (typeof(childObject) == STRING && key != '$ref') {
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
  }
  
}