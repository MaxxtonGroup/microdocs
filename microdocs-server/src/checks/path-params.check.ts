import {PathCheck} from "./path-check";
import {Path, ProblemReport, ProblemLevel, Project, Parameter} from "microdocs-core-ts/dist/domain";

export class PathParamsCheck implements PathCheck {

  public getName():string {
    return "path-param";
  }

  public check(clientEndpoint:Path, producerEndpoint:Path, project:Project, problemReport:ProblemReport):void {
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
          problemReport.report(ProblemLevel.WARNING, "path variable '" + clientParamName + " is missing");
        }
        if(producerParam == null){
          problemReport.report(ProblemLevel.WARNING, "path variable '" + producerParam + " is missing on the controller");
        }
        if(clientParam != null && producerParam != null){
          if(clientParam.type != producerParam.type){
            problemReport.report(ProblemLevel.WARNING, "Type mismatches path variable at segment " + i + ", expected: " + producerParam.type + ", found: " + clientParam.type);
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
        if(param.name == name && param.type == 'path'){
          return param;
        }
      }
    }
    return null;
  }
}