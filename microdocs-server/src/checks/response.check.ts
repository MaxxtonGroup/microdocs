
import {PathCheck} from "./path-check";
import {Path, Project, Schema, ProblemLevels} from '@maxxton/microdocs-core/domain';
import {ProblemReporter}  from '@maxxton/microdocs-core/helpers';

export class ResponseCheck implements PathCheck{

  getName():string {
    return "response-check";
  }

  check(clientEndpoint:Path, producerEndpoint:Path, project:Project, problemReport:ProblemReporter):void {
    if(clientEndpoint.responses != undefined && clientEndpoint.responses != null &&
        clientEndpoint.responses['default'] != undefined && clientEndpoint.responses['default'] != null &&
        clientEndpoint.responses['default'].schema != undefined && clientEndpoint.responses['default'].schema != null){

      if(producerEndpoint.responses != undefined && producerEndpoint.responses != null &&
          producerEndpoint.responses['default'] != undefined && producerEndpoint.responses['default'] != null &&
          producerEndpoint.responses['default'].schema != undefined && producerEndpoint.responses['default'].schema != null){

        var producerSchema = producerEndpoint.responses['default'].schema;
        var clientSchema = clientEndpoint.responses['default'].schema;
        this.checkSchema(producerSchema, clientSchema, problemReport, '');
      }else{
        problemReport.report(ProblemLevels.ERROR, "There is no response body");
      }
    }
  }

  private checkSchema(producerSchema:Schema, clientSchema:Schema, problemReport:ProblemReporter, path:string):void {
    if (clientSchema != null && clientSchema != undefined) {
      if (producerSchema != null && producerSchema != undefined) {
        if (clientSchema.type != producerSchema.type) {
          var position = "";
          if(path != ''){
            position = ' at ' + path;
          }
          problemReport.report(ProblemLevels.WARNING, "Type mismatches in response body" + position + ", expected: " + clientSchema.type + ", found: " + producerSchema.type);
        } else {
          if (clientSchema.type == "object") {
            var producerProperties = clientSchema.properties;
            var clientProperties = producerSchema.properties;
            for (var key in producerProperties) {
              this.checkSchema(clientProperties[key], producerProperties[key], problemReport, path + (path == '' ? '' : '.') + key);
            }
          } else if (clientSchema.type == "array") {
            var producerItems = clientSchema.items;
            var clientItems = producerSchema.items;
            this.checkSchema(clientItems, producerItems, problemReport, path + (path == '' ? '' : '.') + "0");
          }
        }
      } else if (clientSchema.required) {
        problemReport.report(ProblemLevels.ERROR, "Missing required value at " + path);
      }
    }
  }

}