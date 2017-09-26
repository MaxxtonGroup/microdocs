import { Middleware, ExpressErrorMiddlewareInterface, Action } from "routing-controllers";
import { LoggerFactory, LogLevel } from "@webscale/logging";
import { JSONResponseInterceptor } from "../interceptors/json-response.interceptor";
import { YamlResponseInterceptor } from "../interceptors/yaml-response.interceptor";
import { Request, Response } from "express";

const logger = LoggerFactory.create();

@Middleware({ type: "after" })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {

  error(error: any, request: Request, response: Response, next: (err?: any) => any) {
    let body: any = {
      message: error.message,
      path: request.path
    };
    body.status = error.httpCode || 500;
    let errorMessage = "Error";
    switch (body.status) {
      case 400:
        errorMessage = "Bad Request";
        break;
      case 401:
        errorMessage = "Unauthorized";
        break;
      case 403:
        errorMessage = "Forbidden";
        break;
      case 404:
        errorMessage = "Not Found";
        break;
      case 500:
        errorMessage = "Internal Server Error";
        if(error.stack) {
          logger.error( error.stack );
        }
        break;
    }
    if (errorMessage) {
      body.error = errorMessage;
    }
    if (logger.shouldLog(LogLevel.debug)) {
      let stack = error.stack;
      if (stack) {
        body.stack = stack.split("\n");
      }
    }

    body.status = body.status || 500;
    let action:Action = {
      request: request,
      response: response
    };
    body = new JSONResponseInterceptor().intercept(action, body);
    body = new YamlResponseInterceptor().intercept(action, body);
    response.status(body.status || 500).send(body);
    next();
  }

}