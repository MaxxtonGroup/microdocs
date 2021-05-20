import { Project, ProjectNode, FlatList, ParameterPlacings, Parameter, SchemaTypes, Path, Schema} from "@maxxton/microdocs-core/dist/domain";
import { SchemaHelper } from "../../node_modules/@maxxton/microdocs-core/dist/helpers/schema/schema.helper";

declare var extention: string;

export default function ( env: string, projects: Array<Project>, projectNodes: Array<ProjectNode>, projectNodesFlat: Array<ProjectNode>, current: Project, currentNode?: ProjectNode ): any {
  let className = snakeToCamel(current.info.title);
  className = className.substring(0, 1).toUpperCase() + className.substring(1);
  className = className.replace(/Service$/, 'Client');
  const description = current.info ? current.info.description.replace(/\n/g, '\n *') : `Client for the ${current.info.title}`;
  let content = `
import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import {
    Client, RestClient, HttpClient,
    MediaType, Produces,
    Body, Header, Query, Path,
    Headers, Map, OnEmit,
    Get, Post, Patch, Put, Delete, Head } from "@maxxton/angular-rest";
import { RestService } from "../services/rest.service";

/**
 * ${description}
 * @author MicroDocs
 */
@Client({
  serviceId: '${current.info.title}',
  baseUrl: ''
})
@Injectable()
export class ${className} extends RestClient {

  constructor( private rs: RestService ) {
    super(<HttpClient> rs);
  }
`;

  const definitions: {[name: string]: Schema} = {};

  if (current.paths) {
    for (const path in current.paths) {
      for (const method in current.paths[path]) {
        const endpoint = current.paths[path][method];
        let endpointContent = '';
        const descParams = endpoint.parameters ? endpoint.parameters.filter(param => param.description && param.description.trim()) : [];
        const returnResponse: string = endpoint.responses ? Object.keys(endpoint.responses).filter(key => endpoint.responses[key].description && endpoint.responses[key].description.trim())[0] : undefined;
        if ((endpoint.description && endpoint.description.trim()) || descParams.length > 0 || returnResponse) {
          endpointContent = `
  /**
   * ${endpoint.description.replace(/\n/g, '\n   *') || ''}`;
          descParams.forEach(param => {
            endpointContent += `\n   * @param ${param.name} ${param.description}`;
          });
          if (returnResponse) {
            endpointContent += `\n   * @return ${endpoint.responses[returnResponse].description}`;
          }
          endpointContent += '\n   */';
        }

        const returnType = getReturnType(endpoint);
        endpointContent += `\n  @${ucFirst(method)}('${path}')`;
        if (returnType !== 'Response') {
          endpointContent += `\n  @Produces(MediaType.JSON)`;
        }
        endpointContent += `\n  public ${endpoint.operationId} ( `;

        if (endpoint.parameters) {
          const paramContent = endpoint.parameters.sort(sortParams).map(param => {
            return `@${ucFirst(param.in)}` + (param.in === ParameterPlacings.BODY ? '' : `('${param.name}')`) + ` ${param.name}` + (param.required || param.in === ParameterPlacings.BODY ? '' : '?') + `: ${getType(param)}`;
          }).join(', ');
          endpointContent += paramContent;
        }
        endpointContent += '):Observable <' + getReturnType(endpoint) + '> { return null; }\n';
        content += endpointContent;
      }
    }
  }

  content += "\n}";

  function snakeToCamel(s: string): string {
    return s.replace(/(\-\w)/g, function(m) {return m[1].toUpperCase(); });
  }

  function ucFirst(s: string): string {
    return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
  }

  function sortParams(p1: Parameter, p2: Parameter): number {
    if ((p1.required || p1.in === ParameterPlacings.BODY) == (p2.required || ParameterPlacings.BODY)) {
      const val1 = getPlacingValue(p1.in);
      const val2 = getPlacingValue(p2.in);
      return val2 - val1;
    } else if (p1.required || p1.in === ParameterPlacings.BODY) {
      return -1;
    } else {
      return 1;
    }
  }

  function getPlacingValue(placing: string): number {
    switch (placing.toLowerCase()) {
      case ParameterPlacings.PATH: return 1;
      case ParameterPlacings.BODY: return 2;
      case ParameterPlacings.QUERY: return 3;
      case ParameterPlacings.HEADER: return 4;
      case ParameterPlacings.FORMDATA: return 5;
    }
    return 6;
  }

  function getType(param: Parameter): string {
    if (param.schema) {
      let schema = param.schema;
      if (schema.$ref) {
        schema = SchemaHelper.resolveReference(schema.$ref, current);
      }
      definitions[schema.name] = schema;
      return schema.name || 'any';
    } else if (param.type) {
      let type = param.type;
      if (type === SchemaTypes.INTEGER) {
        type = SchemaTypes.NUMBER;
      }
      if (type === SchemaTypes.DATE || type === SchemaTypes.ENUM) {
        type = SchemaTypes.STRING;
      }
      if (type === SchemaTypes.ARRAY) {
        return 'any[]';
      }
      return type || 'any';
    } else {
      return 'any';
    }
  }

  function getReturnType(endpoint: Path): string {
    if (endpoint.responses) {
      if (endpoint.responses['default'] && endpoint.responses['default'].schema) {
        let schema = endpoint.responses['default'].schema;
        if (schema.$ref) {
          schema = SchemaHelper.resolveReference(schema.$ref, current);
        }
        definitions[schema.name] = schema;
        return schema.name || 'Response';
      } else {
        let result = 'Response';
        Object.keys(endpoint.responses).sort().some(code => {
          if (endpoint.responses[code].schema) {
            let schema = endpoint.responses[code].schema;
            if (schema.$ref) {
              schema = SchemaHelper.resolveReference(schema.$ref, current);
            }
            definitions[schema.name] = schema;
            result = schema.name;
            return true;
          }
          return false;
        });
        return result;
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
