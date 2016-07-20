import {PathCheck} from "./path-check";
import {Project, Path, Schema, ProblemReport, ProblemLevel} from "microdocs-core-ts/dist/domain";
import {SchemaHelper} from "microdocs-core-ts/dist/helpers";

export class BodyParamsCheck implements PathCheck {

  public getName():string {
    return "body-param";
  }

  public check(clientEndpoint:Path, producerEndpoint:Path, project:Project, problemReport:ProblemReport):void {
    var producerParams = producerEndpoint.parameters;
    var clientParams = clientEndpoint.parameters;
    if (producerParams == undefined || producerParams == null) {
      producerParams = [];
    }
    if (clientParams == undefined || clientParams == null) {
      clientParams = [];
    }
    producerParams.forEach(producerParam => {
      if (producerParam.in == "body" && producerParam.required) {
        var exists = false;
        clientParams.forEach(clientParam => {
          if (producerParam.in == clientParam.in) {
            exists = true;
            var producerSchema:Schema = SchemaHelper.collect(producerParam.schema, project.definitions);
            var clientSchema = SchemaHelper.collect(clientParam.schema, project.definitions);
            this.checkSchema(clientSchema, producerSchema, problemReport, "body");

            if (producerParam.type != clientParam.type) {
              problemReport.report(ProblemLevel.WARNING, "Type mismatches query parameter " + producerParam.name + ", expected: " + producerParam.type + ", found: " + clientParam.type);
            }
            return true;
          }
        });
        if (!exists) {
          problemReport.report(ProblemLevel.WARNING, "Missing request body");
        }
      }
    });
  }

  private checkSchema(clientSchema:Schema, producerSchema:Schema, problemReport:ProblemReport, path:string):void {
    if(producerSchema != null && producerSchema != undefined){
      if(clientSchema != null && clientSchema != undefined){
        if(producerSchema.type != clientSchema.type){
          problemReport.report(ProblemLevel.WARNING, "Type mismatches in request body at " + path + ", expected: " + producerSchema.type + ", found: " + clientSchema.type);
        }else{
          if(producerSchema.type == "object"){
            var producerProperties = producerSchema.properties;
            var clientProperties = clientSchema.properties;
            for(var key in producerProperties){
              this.checkSchema(clientProperties[key], producerProperties[key], problemReport, path + "." + key);
            }
          }else if(producerSchema.type == "array"){
            var producerItems = producerSchema.items;
            var clientItems = clientSchema.items;
            this.checkSchema(clientItems, producerItems, problemReport, path + ".0");
          }
        }
      }else if(producerSchema.required){
        problemReport.report(ProblemLevel.WARNING, "Missing required value at " + path);
      }
    }
  }

}