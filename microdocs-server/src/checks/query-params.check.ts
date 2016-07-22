import {PathCheck} from "./path-check";
import {Path, Project} from "microdocs-core-ts/dist/domain";
import {WARNING} from "microdocs-core-ts/dist/domain/problem/problem-level.model";
import {ProblemReporter}  from 'microdocs-core-ts/dist/helpers';

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
      if(producerParam.in == "query" && producerParam.required){
        var exists = false;
        clientParams.forEach(clientParam => {
          if(producerParam.name == clientParam.name && producerParam.in == clientParam.in){
            exists = true;
            if(producerParam.type != clientParam.type){
              problemReport.report(WARNING, "Type mismatches query parameter " + producerParam.name + ", expected: " + producerParam.type + ", found: " + clientParam.type);
            }
            return true;
          }
        });
        if(!exists){
          problemReport.report(WARNING, "Missing query parameter " + producerParam.name);
        }
      }
    });
  }

}