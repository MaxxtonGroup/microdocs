import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { LoggerFactory, LogLevel } from "@webscale/logging";
import { Response, Request } from "express";
import { DEFAULT_FULL_SCHEMA } from "js-yaml";
import * as yaml from "js-yaml";

const logger = LoggerFactory.create();

const MIME_YAML = [ "text/yaml", "text/x-yaml", "application/yaml", "application/x-yaml" ];

import {Interceptor, InterceptorInterface, Action} from "routing-controllers";

@Interceptor({priority: 2})
export class YamlResponseInterceptor implements InterceptorInterface {

  intercept(action: Action, content: any) {
    let mime = action.request.accepts( MIME_YAML );
    if (mime && !action.response.converted) {
      if ( content ) {
        let safeContent = JSON.parse(JSON.stringify(content));
        content = yaml.safeDump( safeContent, { schema: DEFAULT_FULL_SCHEMA } );
        if(MIME_YAML.indexOf(mime) !== -1){
          action.response.contentType(mime);
        }else{
          action.response.contentType(MIME_YAML[0]);
        }
        action.response.converted = true;
      }
    }

    return content;
  }

}