import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { LoggerFactory, LogLevel } from "@webscale/logging";
import {Request, Response} from "express";
import { json, Options } from "body-parser";
import * as bytes from 'bytes';
import * as yaml from "js-yaml";
import { DEFAULT_FULL_SCHEMA } from "js-yaml";
import * as typeis from 'type-is';
import * as createError from 'http-errors';
const read = require("body-parser/lib/read");
const debug = require('debug')('body-parser:json');
const contentType = require('content-type');

const logger = LoggerFactory.create();

@Middleware({ type: "before" })
export class JSONRequestMiddleware implements ExpressMiddlewareInterface {

  public use( request: Request, response: Response, next: ( err?: any ) => any ): any {
    let middleware = yamlMiddleware({
      limit: '10mb'
    });
    middleware(request, response, next);
  }

}

function yamlMiddleware(options: Options) {
  let opts = options || {};

  let limit = typeof opts.limit !== 'number' ? bytes.parse(opts.limit || '100kb') : opts.limit;
  let inflate = opts.inflate !== false;
  let type = opts.type || 'application/json';
  let verify = opts.verify || false;

  if (verify !== false && typeof verify !== 'function') {
    throw new TypeError('option verify must be function')
  }

  function parse(body:any) {
    if (body.length === 0) {
      // special-case empty json body, as it's a common client-side mistake
      return {}
    }

    return yaml.safeLoad( body.toString(), {schema: DEFAULT_FULL_SCHEMA } );
  }

  return function jsonParser(req:Request, res:Response, next: (err?: any) => any) {
    if ((<any>req)._body) {
      next();
      return
    }

    req.body = req.body || {};

    // skip requests without bodies
    if (!typeis.hasBody(req)) {
      next();
      return
    }

    // assert charset per RFC 7159 sec 8.1
    let charset = getCharset(req) || 'utf-8';
    if (charset.substr(0, 4) !== 'utf-') {
      next(createError(415, 'unsupported charset "' + charset.toUpperCase() + '"', {
        charset: charset
      }));
      return
    }

    // read
    read(req, res, next, parse, debug, {
      encoding: charset,
      inflate: inflate,
      limit: limit,
      verify: verify
    })
  }
}

/**
 * Get the charset of a request.
 *
 * @param {object} req
 * @api private
 */

function getCharset (req:Request) {
  try {
    return contentType.parse(req).parameters.charset.toLowerCase()
  } catch (e) {
    return undefined
  }
}