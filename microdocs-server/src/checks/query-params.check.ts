import {PathCheck} from "./path-check";
import {Path, Project, ProblemLevels} from "@maxxton/microdocs-core/domain";
import {ProblemReporter}  from '@maxxton/microdocs-core/helpers';

export class QueryParamsCheck implements PathCheck {

  public getName():string {
    return "query-param";
  }

  public check(clientEndpoint:Path, producerEndpoint:Path, project:Project, problemReport:ProblemReporter):void {
    var producerParams = producerEndpoint.parameters;
    var clientParams = clientEndpoint.parameters;
    if (producerParams == undefined || producerParams == null) {
      producerParams = [];
    }
    if (clientParams == undefined || clientParams == null) {
      clientParams = [];
    }
    producerParams.forEach(producerParam => {
      if(producerParam.in == "query"){
        var exists = false;
        clientParams.forEach(clientParam => {
          if(producerParam.name == clientParam.name && producerParam.in == clientParam.in){
            exists = true;
            if(producerParam.type != clientParam.type){
              problemReport.report(ProblemLevels.WARNING, "Type mismatches query parameter '" + producerParam.name + "', expected: '" + producerParam.type + "', found: '" + clientParam.type + "'", clientEndpoint.controller, clientEndpoint.method);
            }
            return true;
          }
        });
        if(!exists && producerParam.required){
          problemReport.report(ProblemLevels.ERROR, "Missing query parameter '" + producerParam.name + "'", clientEndpoint.controller, clientEndpoint.method);
        }
      }
    });
  }

}