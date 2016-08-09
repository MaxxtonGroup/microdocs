import {ResponseHandler} from "./response.handler";
import {JsonResponseHandler} from "./json.handler";
import {YamlResponseHandler} from "./yaml.handler";
import * as express from "express";

export class ResponseHelper{

  private static jsonResponse = new JsonResponseHandler();
  private static yamlResponse = new YamlResponseHandler();

  private static responses:{[key:string]:ResponseHandler} = {
      "application/json": ResponseHelper.jsonResponse,
      "application/yaml": ResponseHelper.yamlResponse
  };

  static getDefaultHandler():ResponseHandler{
    return ResponseHelper.jsonResponse;
  }

  static getHandler(req: express.Request):ResponseHandler{
    var accept = req.get('accept');
    if(accept == undefined){
      return ResponseHelper.getDefaultHandler();
    }else{
      for(var mime in this.responses){
        if(req.accepts(mime)){
          return this.responses[mime];
        }
      }
      return null;
    }
  }

}