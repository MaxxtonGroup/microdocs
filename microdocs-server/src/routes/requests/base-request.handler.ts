import * as express from 'express';
import { Request } from "./request";
import { getTempFolder } from "../../helpers/file.helper";
import { Config } from "../../config";
import * as path from 'path';

/**
 * @author Steven Hermans
 */
export class BaseRequestHandler {

  public handleRequest(req: express.Request): Request {
    const tempFolder = getTempFolder();
    const request = new Request(tempFolder);
    const contentType: string = req.get('content-type')  || req.query['content-type'] as string;
    const importType: string = req.get('import') || req.query['import'] as string;

    if (contentType) {
      let body: {};
      switch (contentType.toLowerCase()) {
        case 'application/json':
          body = req.body;
          break;
        default:
          request.validateMessage = `content-type '${contentType}' not supported`;
          break;
      }
    } else {
      request.validateMessage = `body is missing, did you set the 'content-type'?`;
    }
    return request;
  }

}
