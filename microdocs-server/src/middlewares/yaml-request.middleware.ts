import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { LoggerFactory, LogLevel } from "@webscale/logging";
import {Request, Response} from "express";
import {json} from "body-parser";

const logger = LoggerFactory.create();

@Middleware({ type: "before" })
export class YamlRequestMiddleware implements ExpressMiddlewareInterface {

  public use( request: Request, response: Response, next: ( err?: any ) => any ): any {
    let middleware = json({
      limit: '10mb',
      strict: true
    });
    middleware(request, response, next);
  }



}