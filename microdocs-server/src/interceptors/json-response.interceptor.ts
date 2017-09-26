import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { LoggerFactory, LogLevel } from "@webscale/logging";
import { Response, Request } from "express";
import { DEFAULT_FULL_SCHEMA } from "js-yaml";
import * as yaml from "js-yaml";

const logger = LoggerFactory.create();

const MINE_JSON = [ "application/json" ];

import {Interceptor, InterceptorInterface, Action} from "routing-controllers";

@Interceptor()
export class JSONResponseInterceptor implements InterceptorInterface {

  intercept(action: Action, content: any) {
    let mime = action.request.accepts( MINE_JSON );
    if (mime && !action.response.converted) {
      if ( content ) {
        content = JSON.stringify(content);
        if(MINE_JSON.indexOf(mime) !== -1){
          action.response.contentType(mime);
        }else{
          action.response.contentType(MINE_JSON[0]);
        }
        action.response.converted = true;
      }
    }

    return content;
  }

}