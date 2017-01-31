"use strict";
var domain_1 = require("../../../node_modules/@maxxton/microdocs-core/domain");
var schema_helper_1 = require("../../../node_modules/@maxxton/microdocs-core/helpers/schema/schema.helper");
function default_1(env, projects, projectNodes, projectNodesFlat, current, currentNode) {
    var className = snakeToCamel(current.info.title);
    className = className.substring(0, 1).toUpperCase() + className.substring(1);
    className = className.replace(/Service$/, 'Client');
    var content = "\nimport { Injectable } from \"@angular/core\";\nimport { Response } from \"@angular/http\";\nimport { Observable } from \"rxjs/Observable\";\nimport { \n    Client, RestClient, HttpClient, \n    MediaType, Produces,\n    Body, Header, Query, Path,\n    Headers, Map, OnEmit,\n    Get, Post, Patch, Put, Delete, Head } from \"@maxxton/angular-rest\";\nimport { RestService } from \"../services/rest.service\";\n\n/**\n * " + current.info.description.replace(/\n/g, '\n *') + "\n * @author MicroDocs\n */\n@Client({\n  serviceId: '" + current.info.title + "',\n  baseUrl: ''\n})\n@Injectable()\nexport class " + className + " extends RestClient {\n\n  constructor( private rs: RestService ) {\n    super(<HttpClient> rs);\n  }\n";
    var definitions = {};
    if (current.paths) {
        for (var path in current.paths) {
            var _loop_1 = function (method) {
                var endpoint = current.paths[path][method];
                var endpointContent = '';
                var descParams = endpoint.parameters ? endpoint.parameters.filter(function (param) { return param.description && param.description.trim(); }) : [];
                if ((endpoint.description && endpoint.description.trim()) || descParams.length > 0) {
                    endpointContent = "\n  /**\n   * " + (endpoint.description.replace(/\n/g, '\n   *') || '');
                    descParams.forEach(function (param) {
                        endpointContent += "\n   * @param " + param.name + " " + param.description;
                    });
                    endpointContent += '\n   */';
                }
                var returnType = getReturnType(endpoint);
                endpointContent += "\n  @" + ucFirst(method) + "('" + path + "')";
                if (returnType !== 'Response') {
                    endpointContent += "\n  @Produces(MediaType.JSON)";
                }
                endpointContent += "\n  public " + endpoint.operationId + " ( ";
                if (endpoint.parameters) {
                    var paramContent = endpoint.parameters.sort(sortParams).map(function (param) {
                        return "@" + ucFirst(param.in) + (param.in === domain_1.ParameterPlacings.BODY ? '' : "('" + param.name + "')") + (" " + param.name) + (param.required || param.in === domain_1.ParameterPlacings.BODY ? '' : '?') + (": " + getType(param));
                    }).join(', ');
                    endpointContent += paramContent;
                }
                endpointContent += '):Observable <' + getReturnType(endpoint) + '> { return null; }\n';
                content += endpointContent;
            };
            for (var method in current.paths[path]) {
                _loop_1(method);
            }
        }
    }
    content += "\n}";
    function snakeToCamel(s) {
        return s.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
    }
    function ucFirst(s) {
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }
    function sortParams(p1, p2) {
        if ((p1.required || p1.in === domain_1.ParameterPlacings.BODY) == (p2.required || domain_1.ParameterPlacings.BODY)) {
            var val1 = getPlacingValue(p1.in);
            var val2 = getPlacingValue(p2.in);
            return val2 - val1;
        }
        else if (p1.required || p1.in === domain_1.ParameterPlacings.BODY) {
            return -1;
        }
        else {
            return 1;
        }
    }
    function getPlacingValue(placing) {
        switch (placing.toLowerCase()) {
            case domain_1.ParameterPlacings.PATH: return 1;
            case domain_1.ParameterPlacings.BODY: return 2;
            case domain_1.ParameterPlacings.QUERY: return 3;
            case domain_1.ParameterPlacings.HEADER: return 4;
            case domain_1.ParameterPlacings.FORMDATA: return 5;
        }
        return 6;
    }
    function getType(param) {
        if (param.schema) {
            var schema = param.schema;
            if (schema.$ref) {
                schema = schema_helper_1.SchemaHelper.resolveReference(schema.$ref, current);
            }
            definitions[schema.name] = schema;
            return schema.name || 'any';
        }
        else if (param.type) {
            var type = param.type;
            if (type === domain_1.SchemaTypes.INTEGER) {
                type = domain_1.SchemaTypes.NUMBER;
            }
            if (type === domain_1.SchemaTypes.DATE || type === domain_1.SchemaTypes.ENUM) {
                type = domain_1.SchemaTypes.STRING;
            }
            return type || 'any';
        }
        else {
            return 'any';
        }
    }
    function getReturnType(endpoint) {
        if (endpoint.responses) {
            if (endpoint.responses['default'] && endpoint.responses['default'].schema) {
                var schema = endpoint.responses['default'].schema;
                if (schema.$ref) {
                    schema = schema_helper_1.SchemaHelper.resolveReference(schema.$ref, current);
                }
                definitions[schema.name] = schema;
                return schema.name || 'Response';
            }
            else {
                var result_1 = 'Response';
                Object.keys(endpoint.responses).sort().some(function (code) {
                    if (endpoint.responses[code].schema) {
                        var schema = endpoint.responses[code].schema;
                        if (schema.$ref) {
                            schema = schema_helper_1.SchemaHelper.resolveReference(schema.$ref, current);
                        }
                        definitions[schema.name] = schema;
                        result_1 = schema.name;
                        return true;
                    }
                    return false;
                });
                return result_1;
            }
        }
        return 'Response';
    }
    // Return docker compose as an object
    return {
        extension: 'text',
        body: content
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;