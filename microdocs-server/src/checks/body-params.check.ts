import {PathCheck} from "./path-check";
import {Project, Path, Schema} from "microdocs-core-ts/dist/domain";
import {SchemaHelper, ProblemReporter} from "microdocs-core-ts/dist/helpers";
import {WARNING} from "microdocs-core-ts/dist/domain/problem/problem-level.model";
import {BODY} from 'microdocs-core-ts/dist/domain/path/parameter-placing.model';
import {OBJECT, ARRAY} from 'microdocs-core-ts/dist/domain/schema/schema-type.model';

export class BodyParamsCheck implements PathCheck {

  public getName():string {
    return "body-param";
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
      if (producerParam.in == BODY) {
        var exists = false;
        clientParams.forEach(clientParam => {
          if (producerParam.in == clientParam.in) {
            exists = true;
            var producerSchema:Schema = SchemaHelper.collect(producerParam.schema, [], project);
            var clientSchema = SchemaHelper.collect(clientParam.schema, [], project);
            this.checkSchema(clientSchema, producerSchema, problemReport, "");
            return true;
          }
        });
        if (!exists && producerParam.required) {
          problemReport.report(WARNING, "Missing request body");
        }
      }
    });
  }

  private checkSchema(clientSchema:Schema, producerSchema:Schema, problemReport:ProblemReporter, path:string):void {
    if(producerSchema != null && producerSchema != undefined){
      if(clientSchema != null && clientSchema != undefined){
        if(producerSchema.type != clientSchema.type){
          var position = "";
          if(path != ''){
            position = ' at ' + path;
          }
          problemReport.report(WARNING, "Type mismatches in request body" + position + ", expected: " + producerSchema.type + ", found: " + clientSchema.type);
        }else{
          if(producerSchema.type == OBJECT){
            var producerProperties = producerSchema.properties;
            var clientProperties = clientSchema.properties;
            for(var key in producerProperties){
              this.checkSchema(clientProperties[key], producerProperties[key], problemReport, path + (path == '' ? '' : '.') + key);
            }
          }else if(producerSchema.type == ARRAY){
            var producerItems = producerSchema.items;
            var clientItems = clientSchema.items;
            this.checkSchema(clientItems, producerItems, problemReport, path + (path == '' ? '' : '.') + "0");
          }
        }
      }else if(producerSchema.required){
        problemReport.report(WARNING, "Missing required value at " + path);
      }
    }
  }

}