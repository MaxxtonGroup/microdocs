
import {PathCheck} from "./path-check";
import {Path, Project, ProblemReport, Schema, ProblemLevel} from 'microdocs-core-ts/dist/domain';

export class ResponseCheck implements PathCheck{

  getName():string {
    return "response-check";
  }

  check(clientEndpoint:Path, producerEndpoint:Path, project:Project, problemReport:ProblemReport):void {
    if(clientEndpoint.responses != undefined && clientEndpoint.responses != null &&
        clientEndpoint.responses['default'] != undefined && clientEndpoint.responses['default'] != null &&
        clientEndpoint.responses['default'].schema != undefined && clientEndpoint.responses['default'].schema != null){

      if(producerEndpoint.responses != undefined && producerEndpoint.responses != null &&
          producerEndpoint.responses['default'] != undefined && producerEndpoint.responses['default'] != null &&
          producerEndpoint.responses['default'].schema != undefined && producerEndpoint.responses['default'].schema != null){

        var producerSchema = producerEndpoint.responses['default'].schema;
        var clientSchema = clientEndpoint.responses['default'].schema;
        this.checkSchema(producerSchema, clientSchema, problemReport, 'response');
      }else{
        problemReport.report(ProblemLevel.WARNING, "There is no response body");
      }
    }
  }

  private checkSchema(producerSchema:Schema, clientSchema:Schema, problemReport:ProblemReport, path:string):void {
    if (clientSchema != null && clientSchema != undefined) {
      if (producerSchema != null && producerSchema != undefined) {
        if (clientSchema.type != producerSchema.type) {
          problemReport.report(ProblemLevel.WARNING, "Type mismatches in request body at " + path + ", expected: " + clientSchema.type + ", found: " + producerSchema.type);
        } else {
          if (clientSchema.type == "object") {
            var producerProperties = clientSchema.properties;
            var clientProperties = producerSchema.properties;
            for (var key in producerProperties) {
              this.checkSchema(clientProperties[key], producerProperties[key], problemReport, path + "." + key);
            }
          } else if (clientSchema.type == "array") {
            var producerItems = clientSchema.items;
            var clientItems = producerSchema.items;
            this.checkSchema(clientItems, producerItems, problemReport, path + ".0");
          }
        }
      } else if (clientSchema.required) {
        problemReport.report(ProblemLevel.WARNING, "Missing required value at " + path);
      }
    }
  }

}