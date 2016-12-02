import * as express from 'express';
import { Request } from "./request";
import { getTempFolder } from "../../helpers/file.helper";
import { Config } from "../../config";
import * as path from 'path';

/**
 * @author Steven Hermans
 */
export class BaseRequestHandler {

  public handleRequest(req:express.Request):Request{
    let tempFolder = getTempFolder();
    let request = new Request(tempFolder);
    let contentType:string = req.get('content-type') || req.query['content-type'];
    let importType:string = req.get('import') || req.query['import'];

    if(contentType){
      let body:{};
      switch(contentType.toLowerCase()){
        case 'application/json':
          body = req.body;
          break;
        default:
          request.validateMessage = `content-type '${contentType}' not supported`;
          break;
      }
    }else{
      request.validateMessage = `body is missing, did you set the 'content-type'?`;
    }
    return request;
  }

}