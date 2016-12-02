import { PathCheck } from "./path-check";
import {
    Path,
    Project,
    Parameter,
    ParameterPlacings,
    ProblemLevels,
    SchemaTypes
} from "@maxxton/microdocs-core/domain";
import { ProblemReporter }  from '@maxxton/microdocs-core/helpers';

export class PathParamsCheck implements PathCheck {

  public getName():string {
    return "path-param";
  }

  public check( clientEndpoint:Path, producerEndpoint:Path, project:Project, problemReport:ProblemReporter ):void {
    // match via wildcards in regexp
    var expression               = '^' + producerEndpoint.path.replace( new RegExp( "\/", 'g' ), '\/' ).replace( new RegExp( "\\{.*?\\}", 'g' ), '(.+)' ) + '$';
    var clientExp                = new RegExp( expression );
    var producerExp              = new RegExp( "\\{.*?\\}", 'g' );
    var clientMatches:string[]   = clientEndpoint.path.match( clientExp );
    var producerMatches:string[] = producerEndpoint.path.match( producerExp );

    if ( clientMatches && producerMatches && clientMatches.length == producerMatches.length + 1 && clientMatches.length >= 1 ) {
      for ( let i = 1; i < clientMatches.length; i++ ) {
        let producerParamName = producerMatches[ i - 1 ].substr( 1, producerMatches[i-1].length-2 );
        let producerParam     = this.getPathVariable( producerParamName, producerEndpoint );
        if ( producerParam == null ) {
          problemReport.report( ProblemLevels.ERROR, "path variable '" + producerParamName + "' is missing on the controller", clientEndpoint.controller, clientEndpoint.method );
        } else {
          let clientParamName = clientMatches[ i ];
          if ( clientParamName.match( /^\{.*?\}$/ ) ) {
            var clientParam = this.getPathVariable( clientParamName.substr( 1, clientParamName.length-2 ), clientEndpoint );
            if ( clientParam == null ) {
              problemReport.report( ProblemLevels.ERROR, "path variable '" + clientParamName.substr( 1, clientParamName.length-2 ) + "' is missing", clientEndpoint.controller, clientEndpoint.method );
            }
            if ( clientParam != null && producerParam != null ) {
              if ( clientParam.type !== producerParam.type &&
                  !((clientParam.type === SchemaTypes.NUMBER || clientParam.type === SchemaTypes.INTEGER) &&
                  (producerParam.type === SchemaTypes.NUMBER || producerParam.type === SchemaTypes.INTEGER))) {
                problemReport.report( ProblemLevels.WARNING, "Type mismatches path variable '" + clientParamName.substr( 1, clientParamName.length-2 ) + "', expected: " + producerParam.type + ", found: " + clientParam.type, clientEndpoint.controller, clientEndpoint.method );
              }
            }
          } else {
            var value = clientParamName;
            switch ( producerParam.type.toLowerCase() ) {
              case SchemaTypes.NUMBER:
              case SchemaTypes.INTEGER:
                if ( !parseInt( value ) ) {
                  problemReport.report( ProblemLevels.WARNING, "Type mismatches path variable '" + producerParamName + "' is not a number', expected: " + producerParam.type + ", found: number", clientEndpoint.controller, clientEndpoint.method );
                }
                break;
            }
          }
        }
      }
    }
  }

  private getPathVariable( name:string, path:Path ):Parameter {
    if ( path.parameters != undefined && path.parameters != null ) {
      for ( var i = 0; i < path.parameters.length; i++ ) {
        var param = path.parameters[ i ];
        if ( param.name == name && param.in == ParameterPlacings.PATH ) {
          return param;
        }
      }
    }
    return null;
  }
}