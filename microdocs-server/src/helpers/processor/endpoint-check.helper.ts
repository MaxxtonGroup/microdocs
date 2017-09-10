import {
  Path,
  Project,
  Parameter,
  ParameterPlacings,
  SchemaTypes,
  Schema,
  Level,
  ProblemReport
} from "@maxxton/microdocs-core/domain";
import { SchemaHelper } from "@maxxton/microdocs-core/helpers";

export function checkQueryParameters( clientEndpoint: Path, producerEndpoint: Path, clientProject: Project, producerProject: Project, problemReport: ProblemReport ): void {
  if ( producerEndpoint.parameters ) {
    let parameters   = producerEndpoint.parameters.filter( param => param.in === ParameterPlacings.QUERY );
    let clientParams = clientEndpoint.parameters;
    parameters.forEach( producerParam => {
      let exists = false;
      if ( clientParams ) {
        clientParams.forEach( clientParam => {
          if ( producerParam.name == clientParam.name && producerParam.in == clientParam.in ) {
            exists = true;
            if ( !matchType( producerParam, clientParam ) ) {
              problemReport.add( {
                level: Level.Warning,
                message: `Type Query parameter '${producerParam.name}' Mismatches for endpoint '${producerEndpoint.method} ${producerEndpoint.path}'. The ${producerProject.info.title} expects type '${producerParam.type}', but the ${clientProject.info.title} provides type '${clientParam.type}'`,
                hint: `Change the Type of the Query parameter '${clientParam.name}' to '${producerParam.type}' for endpoint '${clientEndpoint.method} ${clientEndpoint.path}' on the ${clientProject.name}`,
                sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
                source: clientProject,
                sourceClass: clientEndpoint.controller,
                sourceMethod: clientEndpoint.method,
                targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
                target: producerProject,
                targetClass: producerEndpoint.controller,
                targetMethod: producerEndpoint.method
              } );
            }
            return true;
          }
          return false;
        } );
      }
      if ( !exists && producerParam.required ) {
        problemReport.add( {
          level: Level.Warning,
          message: `Query parameter '${producerParam.name}' is required for endpoint '${producerEndpoint.method} ${producerEndpoint.path}' on the ${producerProject.info.title}, but the ${clientProject.info.title} doesn't provide it`,
          hint: `Add the missing Query parameter '${producerParam.name}' on the client of the ${clientProject.info.title} or don't make it required`,
          sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
          source: clientProject,
          sourceClass: clientEndpoint.controller,
          sourceMethod: clientEndpoint.method,
          targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
          target: producerProject,
          targetClass: producerEndpoint.controller,
          targetMethod: producerEndpoint.method
        } );
      }
    } );
  }
}

export function checkPathParameters( clientEndpoint: Path, producerEndpoint: Path, clientProject: Project, producerProject: Project, problemReport: ProblemReport ): void {
  // match via wildcards in regexp
  let expression                = '^' + producerEndpoint.path.replace( new RegExp( "\/", 'g' ), '\/' ).replace( new RegExp( "\\{.*?\\}", 'g' ), '(.+)' ) + '$';
  let clientExp                 = new RegExp( expression );
  let producerExp               = new RegExp( "\\{.*?\\}", 'g' );
  let clientMatches: string[]   = clientEndpoint.path.match( clientExp );
  let producerMatches: string[] = producerEndpoint.path.match( producerExp );

  if ( clientMatches && producerMatches && clientMatches.length == producerMatches.length + 1 && clientMatches.length >= 1 ) {
    for ( let i = 1; i < clientMatches.length; i++ ) {
      let producerParamName = producerMatches[ i - 1 ].substr( 1, producerMatches[ i - 1 ].length - 2 );
      let producerParam     = getPathVariable( producerParamName, producerEndpoint );
      if ( producerParam == null ) {
        problemReport.add( {
          level: Level.Warning,
          message: `Path variable '${producerParamName.substr( 1, producerParamName.length - 2 )}' is provided in the path of endpoint '${producerEndpoint.method} ${producerEndpoint.path}' on the ${producerProject.info.title}, but never declared or used on the controller parameters`,
          hint: `Add the Path variable '${producerParamName.substr( 1, producerParamName.length - 2 )}' as parameter to the controller method of endpoint '${producerEndpoint.method} ${producerEndpoint.path}' on the ${producerProject.info.title}`,
          sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
          source: clientProject,
          sourceClass: clientEndpoint.controller,
          sourceMethod: clientEndpoint.method,
          targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
          target: producerProject,
          targetClass: producerEndpoint.controller,
          targetMethod: producerEndpoint.method
        } );
      } else {
        let clientParamName = clientMatches[ i ];
        if ( clientParamName.match( /^\{.*?\}$/ ) ) {
          let clientParam = getPathVariable( clientParamName.substr( 1, clientParamName.length - 2 ), clientEndpoint );
          if ( clientParam == null ) {
            problemReport.add( {
              level: Level.Warning,
              message: `Path variable '${clientParamName.substr( 1, clientParamName.length - 2 )}' is provided in the path of endpoint '${clientEndpoint.method} ${clientEndpoint.path}' on the ${clientProject.info.title}, but never declared or used on the controller parameters`,
              hint: `Add the Path variable '${clientParamName.substr( 1, clientParamName.length - 2 )}' as parameter to the controller method of endpoint '${clientEndpoint.method} ${clientEndpoint.path}' on the ${clientProject.info.title}`,
              sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
              source: clientProject,
              sourceClass: clientEndpoint.controller,
              sourceMethod: clientEndpoint.method,
              targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
              target: producerProject,
              targetClass: producerEndpoint.controller,
              targetMethod: producerEndpoint.method
            } );
          }
          if ( clientParam != null && producerParam != null ) {
            if ( !matchType( producerParam, clientParam ) ) {
              problemReport.add( {
                level: Level.Warning,
                message: `Type Path parameter '${producerParam.name}' Mismatches for endpoint '${producerEndpoint.method} ${producerEndpoint.path}'. The ${producerProject.info.title} expects type '${producerParam.type}', but the ${clientProject.info.title} provides type '${clientParam.type}'`,
                hint: `Change the Type of the Path parameter '${clientParam.name}' to '${producerParam.type}' for endpoint '${clientEndpoint.method} ${clientEndpoint.path}' on the ${clientProject.name}`,
                sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
                source: clientProject,
                sourceClass: clientEndpoint.controller,
                sourceMethod: clientEndpoint.method,
                targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
                target: producerProject,
                targetClass: producerEndpoint.controller,
                targetMethod: producerEndpoint.method
              } );
            }
          }
        } else {
          let value = clientParamName;
          switch ( producerParam.type.toLowerCase() ) {
            case SchemaTypes.NUMBER:
            case SchemaTypes.INTEGER:
              if ( !parseInt( value ) ) {
                problemReport.add( {
                  level: Level.Warning,
                  message: `Type Path parameter '${producerParam.name}' Mismatches for endpoint '${producerEndpoint.method} ${producerEndpoint.path}'. The ${producerProject.info.title} expects type '${producerParam.type}', but the ${clientProject.info.title} provides type 'string'`,
                  hint: `Change the Type of segment ${i} to '${producerParam.type}' for endpoint '${clientEndpoint.method} ${clientEndpoint.path}' on the ${clientProject.name}`,
                  sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
                  source: clientProject,
                  sourceClass: clientEndpoint.controller,
                  sourceMethod: clientEndpoint.method,
                  targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
                  target: producerProject,
                  targetClass: producerEndpoint.controller,
                  targetMethod: producerEndpoint.method
                } );
              }
              break;
          }
        }
      }
    }
  }
}

function getPathVariable( name: string, path: Path ): Parameter {
  if ( path.parameters != undefined && path.parameters != null ) {
    for ( let i = 0; i < path.parameters.length; i++ ) {
      let param = path.parameters[ i ];
      if ( param.name == name && param.in == ParameterPlacings.PATH ) {
        return param;
      }
    }
  }
  return null;
}

export function checkBodyParameters( clientEndpoint: Path, producerEndpoint: Path, clientProject: Project, producerProject: Project, problemReport: ProblemReport, strict: boolean ): void {
  if ( producerEndpoint.parameters ) {
    let parameters   = producerEndpoint.parameters.filter( param => param.in === ParameterPlacings.BODY );
    let clientParams = clientEndpoint.parameters;
    parameters.forEach( producerParam => {
      let exists = false;
      clientParams.some( clientParam => {
        if ( producerParam.in == clientParam.in ) {
          exists                     = true;
          let producerSchema: Schema = SchemaHelper.collect( producerParam.schema, [], producerProject );
          let clientSchema           = SchemaHelper.collect( clientParam.schema, [], clientProject );
          checkSchema( clientEndpoint, producerEndpoint, clientSchema, producerSchema, clientProject, producerProject, problemReport, "", 'request', strict );
          return true;
        }
        return false;
      } );
      if ( !exists && producerParam.required ) {
        problemReport.add( {
          level: Level.Warning,
          message: `Request Body is missing for endpoint '${clientEndpoint.method} ${clientEndpoint.path}' on the ${clientProject.info.title}, it is required by the ${producerProject.info.title}`,
          hint: `Add a Request Body to the endpoint '${clientEndpoint.method} ${clientEndpoint.path}' on the ${clientProject.info.title}`,
          sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
          source: clientProject,
          sourceClass: clientEndpoint.controller,
          sourceMethod: clientEndpoint.method,
          targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
          target: producerProject,
          targetClass: producerEndpoint.controller,
          targetMethod: producerEndpoint.method
        } );
      }
    } );
  }
}

export function checkResponseBody( clientEndpoint: Path, producerEndpoint: Path, clientProject: Project, producerProject: Project, problemReport: ProblemReport, strict: boolean ): void {
  if ( clientEndpoint.responses != undefined && clientEndpoint.responses != null &&
      clientEndpoint.responses[ 'default' ] != undefined && clientEndpoint.responses[ 'default' ] != null &&
      clientEndpoint.responses[ 'default' ].schema != undefined && clientEndpoint.responses[ 'default' ].schema != null ) {

    if ( producerEndpoint.responses != undefined && producerEndpoint.responses != null &&
        producerEndpoint.responses[ 'default' ] != undefined && producerEndpoint.responses[ 'default' ] != null &&
        producerEndpoint.responses[ 'default' ].schema != undefined && producerEndpoint.responses[ 'default' ].schema != null ) {

      let producerSchema = SchemaHelper.collect( producerEndpoint.responses[ 'default' ].schema, [], producerProject );
      let clientSchema   = SchemaHelper.collect( clientEndpoint.responses[ 'default' ].schema, [], clientProject );
      checkSchema( clientEndpoint, producerEndpoint, clientSchema, producerSchema, clientProject, producerProject, problemReport, '', 'response', strict );
    } else {
      problemReport.add( {
        level: Level.Warning,
        message: `Response Body is expected for endpoint '${clientEndpoint.method} ${clientEndpoint.path}' on the ${clientProject.info.title}, but the ${producerProject.info.title} is not providing one`,
        hint: `Remove the Response Body from the endpoint '${clientEndpoint.method} ${clientEndpoint.path}' on the ${clientProject.info.title}, or Add one to the endpoint on the ${producerProject.info.title}`,
        sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
        source: clientProject,
        sourceClass: clientEndpoint.controller,
        sourceMethod: clientEndpoint.method,
        targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
        target: producerProject,
        targetClass: producerEndpoint.controller,
        targetMethod: producerEndpoint.method
      } );
    }
  }
}


function checkSchema( clientEndpoint: Path, producerEndpoint: Path, clientSchema: Schema, producerSchema: Schema, clientProject: Project, producerProject: Project, problemReport: ProblemReport, path: string, placing: 'request' | 'response', strict: boolean ): void {
  if ( producerSchema != null && producerSchema != undefined ) {
    if ( clientSchema != null && clientSchema != undefined ) {
      if ( !matchType( clientSchema, producerSchema ) ) {
        let position = "";
        if ( path != '' ) {
          position = ' at ' + path;
        }
        problemReport.add( {
          level: Level.Warning,
          message: `Type Mismatches in ${placing} body${position} for endpoint '${producerEndpoint.method} ${producerEndpoint.path}'. The ${producerProject.info.title} expects '${producerSchema.type}', but the ${clientProject.info.title} provides '${clientSchema.type}'`,
          hint: `Change the type of the ${placing} body${position} for endpoint '${producerEndpoint.method} ${producerEndpoint.path}' on either the ${producerProject.info.title} or ${clientProject.info.title}`,
          sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
          source: clientProject,
          sourceClass: clientEndpoint.controller,
          sourceMethod: clientEndpoint.method,
          targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
          target: producerProject,
          targetClass: producerEndpoint.controller,
          targetMethod: producerEndpoint.method
        } );
      } else {
        if ( producerSchema.type == SchemaTypes.OBJECT ) {
          let producerViews = collectViews( producerSchema );
          let clientViews   = collectViews( clientSchema );

          // Check each view for problems
          let problemReports: ProblemReport[] = [];
          producerViews.forEach( producerView => {
            clientViews.forEach( clientView => {
              let report = new ProblemReport();
              problemReports.push( report );

              let producerProperties = producerView.properties;
              let clientProperties   = clientView.properties;

              // Check each producer properties
              if ( producerProperties ) {
                for ( let key in producerProperties ) {
                  // Find client Property by name
                  let producerProperty = producerProperties[ key ];
                  if ( !isProducerIgnored( producerProperty ) ) {
                    let propertyName   = getProducerPropertyMappingName( key, producerProperty );
                    let clientProperty = findClientPropertyByName( propertyName, clientProperties );

                    checkSchema( clientEndpoint, producerEndpoint, clientProperty, producerProperty, clientProject, producerProject, report, path + (path == '' ? '' : '.') + key, placing, strict );
                  }
                }
              }

              // Check unknown client properties
              if ( clientProperties ) {
                for ( let key in clientProperties ) {
                  let clientProperty = clientProperties[ key ];
                  if ( !isClientIgnored( clientProperty ) ) {
                    let name = getClientPropertyMappingName( key, clientProperty );

                    let producerProperty: Schema = null;
                    if ( producerProperties ) {
                      producerProperty = findProducerPropertyByName( name, producerProperties );
                    }
                    if ( !producerProperty ) {
                      let keyPath = path + (path ? '.' : '') + key;
                      problemReport.add( {
                        level: Level.Warning,
                        message: `Unknown property '${keyPath}' in the ${placing} body for endpoint '${producerEndpoint.method} ${producerEndpoint.path}'. The ${clientProject.info.title} has this property, but ${producerProject.info.title} is missing this property`,
                        hint: `Remove or ignore the property '${keyPath}' in the ${placing} body for endpoint '${producerEndpoint.method} ${producerEndpoint.path}' on the ${clientProject.info.title}`,
                        sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
                        source: clientProject,
                        sourceClass: clientEndpoint.controller,
                        sourceMethod: clientEndpoint.method,
                        targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
                        target: producerProject,
                        targetClass: producerEndpoint.controller,
                        targetMethod: producerEndpoint.method
                      } );
                    }
                  }
                }
              }

              // Decorate problems with view info
              if ( producerViews.length > 1 || clientViews.length > 1 ) {
                report.getProblems().forEach( problem => {
                  problem.message = "[" + clientView.name + " > " + producerView.name + "] " + problem.message;
                } );
              }
            } );
          } );

          if ( problemReports.filter( report => report.isCompatible( strict ) ).length == 0 ) {
            // No matching view
            if ( problemReports.length > 1 ) {
              let position = "";
              if ( path != '' ) {
                position = ' at ' + path;
              }

              let clientViewNames   = clientViews.map( view => view.name ).join( "," );
              let producerViewNames = producerViews.map( view => view.name ).join( "," );
              problemReport.add( {
                level: Level.Warning,
                message: `The views in the ${placing} body${position} for endpoint '${producerEndpoint.method} ${producerEndpoint.path}' on the ${clientProject.info.title} [${clientViewNames}] doesn't match any of the views on the ${producerProject.info.title} [${producerViewNames}]. The problems of the most matching view is shown in other issues.`,
                hint: `Make the ${placing} body${position} for endpoint '${producerEndpoint.method} ${producerEndpoint.path}' compatible between the ${clientProject.info.title} and ${producerProject.info.title}`,
                sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
                source: clientProject,
                sourceClass: clientEndpoint.controller,
                sourceMethod: clientEndpoint.method,
                targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
                target: producerProject,
                targetClass: producerEndpoint.controller,
                targetMethod: producerEndpoint.method
              } );
            }
            let mostMatchingProblemReport = problemReports.sort( ( r1, r2 ) => r1.getWarnings().length - r2.getWarnings().length )[ 0 ];
            problemReport.addAll( mostMatchingProblemReport );
          }

        } else if ( producerSchema.type == SchemaTypes.ARRAY ) {
          let producerItems = producerSchema.items;
          let clientItems   = clientSchema.items;
          checkSchema( clientEndpoint, producerEndpoint, clientItems, producerItems, clientProject, producerProject, problemReport, path + (path == '' ? '' : '.') + "0", placing, strict );
        }
      }
    } else {
      if ( producerSchema.required ) {
        problemReport.add( {
          level: Level.Warning,
          message: `Property '${path}' in the ${placing} body for endpoint '${producerEndpoint.method} ${producerEndpoint.path}' on the ${producerProject.info.title}, but the ${clientProject.info.title} doesn't have it`,
          hint: `Add property '${path}' to the ${placing} body for endpoint '${producerEndpoint.method} ${producerEndpoint.path}' on the ${clientProject.info.title}`,
          sourcePath: `dependencies.${clientProject.info.title}.paths.${clientEndpoint.path}.${clientEndpoint.method}`,
          source: clientProject,
          sourceClass: clientEndpoint.controller,
          sourceMethod: clientEndpoint.method,
          targetPath: `paths.${producerEndpoint.path}.${producerEndpoint.method}`,
          target: producerProject,
          targetClass: producerEndpoint.controller,
          targetMethod: producerEndpoint.method
        } );
      }
    }
  }
}

function matchType( clientParam: Parameter, producerParam: Parameter ): boolean {
  // Full match
  if ( producerParam.type === clientParam.type ) {
    return true;
  }

  // Match any
  if ( producerParam.type === SchemaTypes.ANY || clientParam.type === SchemaTypes.ANY ) {
    return true;
  }

  // Match number === integer
  if ( (producerParam.type === SchemaTypes.INTEGER && clientParam.type === SchemaTypes.INTEGER) ||
      (producerParam.type === SchemaTypes.INTEGER && clientParam.type === SchemaTypes.INTEGER) ) {
    return true;
  }

  // Match enum
  if ( producerParam.type === SchemaTypes.ENUM && producerParam.enum && clientParam.default ) {
    if ( producerParam.enum.indexOf( clientParam.default ) > -1 ) {
      return true;
    }
  } else if ( producerParam.type === SchemaTypes.ENUM && clientParam.type === SchemaTypes.STRING ) {
    return true;
  }

  // Match reverse enum
  if ( clientParam.type === SchemaTypes.ENUM && clientParam.enum && clientParam.enum.length > 0 ) {
    if ( producerParam.type === SchemaTypes.INTEGER || producerParam.type === SchemaTypes.NUMBER ) {
      if ( typeof(clientParam.enum[ 0 ]) === 'number' || !isNaN( parseInt( clientParam.enum[ 0 ] ) ) ) {
        return true;
      }
    } else if ( producerParam.type === SchemaTypes.BOOLEAN ) {
      if ( typeof(clientParam.enum[ 0 ]) === 'boolean' || clientParam.enum[ 0 ] === 'true' || clientParam.enum[ 0 ] === 'false' ) {
        return true;
      }
    } else if ( producerParam.type === SchemaTypes.STRING ) {
      if ( typeof(clientParam.enum[ 0 ]) === 'string' ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Find matching client property by name and ignore
 * @param name
 * @param properties
 * @returns {Schema}
 */
function findClientPropertyByName( name: string, properties: { [key: string]: Schema } ): Schema {
  return Object.keys( properties )
  // Filter json.ignore
      .filter( key => {
        let property = properties[ key ];
        if ( property.mappings && property.mappings.json && property.mappings.json.ignore ) {
          return false;
        }
        return true;
      } )
      // Filter client.ignore
      .filter( key => {
        let property = properties[ key ];
        if ( property.mappings && property.mappings.client && property.mappings.client.ignore ) {
          return false;
        }
        return true;
      } )
      // Filter name
      .filter( key => {
        let property     = properties[ key ];
        let propertyName = getClientPropertyMappingName( key, property );
        return propertyName === name;
      } ).map( clientKey => properties[ clientKey ] )[ 0 ];
}

/**
 * Find matching producer property by name and ignore
 * @param name
 * @param properties
 * @returns {Schema}
 */
function findProducerPropertyByName( name: string, properties: { [key: string]: Schema } ): Schema {
  return Object.keys( properties )
  // Filter json.ignore
      .filter( key => {
        let property = properties[ key ];
        if ( property.mappings && property.mappings.json && property.mappings.json.ignore ) {
          return false;
        }
        return true;
      } )
      // Filter name
      .filter( key => {
        let property     = properties[ key ];
        let propertyName = getProducerPropertyMappingName( key, property );
        return propertyName === name;
      } ).map( clientKey => properties[ clientKey ] )[ 0 ];
}

/**
 * Get Client property name
 * Taking mappings in account
 * @param key
 * @param property
 * @returns {string}
 */
function getClientPropertyMappingName( key: string, property: Schema ): string {
  if ( property.mappings ) {
    if ( property.mappings.client && property.mappings.client.name ) {
      // Find client.name
      return property.mappings.client.name;
    }
    if ( property.mappings.json && property.mappings.json.name ) {
      // Find json.name
      return property.mappings.json.name;
    }
  }
  // Fallback on key
  return key;
}

/**
 * Get Producer property name
 * Taking mappings in account
 * @param key
 * @param property
 * @returns {string}
 */
function getProducerPropertyMappingName( key: string, property: Schema ): string {
  if ( property.mappings ) {
    if ( property.mappings.json && property.mappings.json.name ) {
      // Find json.name
      return property.mappings.json.name;
    }
  }
  // Fallback on key
  return key;
}

/**
 * Check if property is not ignored on client side
 * @param property
 * @returns {boolean}
 */
function isClientIgnored( property: Schema ): boolean {
  if ( property.mappings ) {
    if ( property.mappings.json && property.mappings.json.ignore ) {
      return true;
    }
    if ( property.mappings.client && property.mappings.client.ignore ) {
      return true;
    }
  }
  return false;
}

/**
 * Check if property is not ignored on producer side
 * @param property
 * @returns {boolean}
 */
function isProducerIgnored( property: Schema ): boolean {
  if ( property.mappings ) {
    if ( property.mappings.json && property.mappings.json.ignore ) {
      return true;
    }
  }
  return false;
}

function collectViews( schema: Schema ): Schema[] {
  let views = [ schema ];
  if ( schema.anyOf ) {
    schema.anyOf.forEach( view => {
      let baseCopy: Schema = {};
      for ( let key in schema ) {
        if ( key !== 'anyOf' ) {
          baseCopy[ key ] = schema[ key ];
        }
      }
      SchemaHelper.merge( baseCopy, view );
      views.push( baseCopy );
    } );
  }
  return views;
}