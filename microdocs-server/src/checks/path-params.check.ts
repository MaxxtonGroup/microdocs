import {PathCheck} from "./path-check";
import {Path, Project, Parameter} from "microdocs-core-ts/dist/domain";
import {PATH} from "microdocs-core-ts/dist/domain/path/parameter-placing.model";
import {WARNING, ERROR} from "microdocs-core-ts/dist/domain/problem/problem-level.model";
import {ProblemReporter}  from 'microdocs-core-ts/dist/helpers';

export class PathParamsCheck implements PathCheck {

  public getName():string {
    return "path-param";
  }

  public check(clientEndpoint:Path, producerEndpoint:Path, project:Project, problemReport:ProblemReporter):void {
    var clientSegments = clientEndpoint.path.split('/');
    var producerSegments = producerEndpoint.path.split('/');
    for(var i = 0; i < clientSegments.length; i++){
      var clientSegment = clientSegments[i];
      var producerSegment = producerSegments[i];
      if(this.isSegmentVariable(clientSegment) && this.isSegmentVariable(producerSegment)){
        var clientParamName = clientSegment.substring(1, clientSegment.length-1);
        var producerParamName = clientSegment.substring(1, producerSegment.length-1);

        var clientParam = this.getPathVariable(clientParamName, clientEndpoint);
        var producerParam = this.getPathVariable(producerParamName, producerEndpoint);
        if(clientParam == null){
          problemReport.report(ERROR, "path variable '" + clientParamName + "' is missing", clientEndpoint.controller, clientEndpoint.method);
        }
        if(producerParam == null){
          problemReport.report(ERROR, "path variable '" + producerParamName + "' is missing on the controller", clientEndpoint.controller, clientEndpoint.method);
        }
        if(clientParam != null && producerParam != null){
          if(clientParam.type != producerParam.type){
            problemReport.report(WARNING, "Type mismatches path variable '" + clientParamName + "', expected: " + producerParam.type + ", found: " + clientParam.type, clientEndpoint.controller, clientEndpoint.method);
          }
        }
      }
    }
  }

  private isSegmentVariable(segment:string):boolean {
    return segment.indexOf("{") == 0 && segment.lastIndexOf("}") == segment.length - 1;
  }

  private getPathVariable(name:string, path:Path):Parameter{
    if(path.parameters != undefined && path.parameters != null){
      for(var i = 0; i < path.parameters.length; i++){
        var param = path.parameters[i];
        if(param.name == name && param.in == PATH){
          return param;
        }
      }
    }
    return null;
  }
}