import {BaseResponseHandler} from "./base-response.handler";
import * as express from "express";
import {SwaggerResponseHandler} from "./swagger-response.handler";
import {MicroDocsResponseHandler} from "./microdocs-response.handler";
import {PostmanResponseHandler} from "./postman-response.handler";
import {TemplateResponseHandler} from "./template-response.handler";

export class ResponseHelper{

  private static baseResponse = new BaseResponseHandler();
  private static microDocsResponse = new MicroDocsResponseHandler();
  private static swaggerResponse = new SwaggerResponseHandler();
  private static postmanResponse = new PostmanResponseHandler();

  private static responses:{[key:string]:BaseResponseHandler} = {
      "default": ResponseHelper.baseResponse,
      "swagger": ResponseHelper.swaggerResponse,
      "microdocs": ResponseHelper.microDocsResponse,
      "postman": ResponseHelper.postmanResponse
  };

  static getDefaultHandler():BaseResponseHandler{
    return ResponseHelper.baseResponse;
  }

  static getHandler(req: express.Request):BaseResponseHandler{
    var exportType = req.query.export;
    if(exportType == undefined){
      exportType = req.header('export');
      if(exportType == undefined){
        exportType = 'default';
      }
    }
    var response = this.responses[exportType.toLowerCase()];
    if(response == undefined){
      return new TemplateResponseHandler(exportType.toLowerCase());
    }
    return response;
  }

}