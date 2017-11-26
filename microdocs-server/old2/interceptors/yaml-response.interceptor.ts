import { LoggerFactory} from "@webscale/logging";
import { DEFAULT_FULL_SCHEMA } from "js-yaml";
import * as yaml from "js-yaml";

const logger = LoggerFactory.create();

const MIME_JSON = [ "application/json" ];
const MIME_YAML = [ "text/yaml", "text/x-yaml", "application/yaml", "application/x-yaml" ];

import {Interceptor, InterceptorInterface, Action} from "routing-controllers";

@Interceptor()
export class YamlResponseInterceptor implements InterceptorInterface {

  intercept(action: Action, content: any) {
    if(!action.request.accepts(MIME_JSON)){
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
    }

    return content;
  }

}