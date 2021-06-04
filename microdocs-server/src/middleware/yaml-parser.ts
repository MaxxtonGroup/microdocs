
import {Request, Response, NextFunction} from 'express';

const bytes = require('bytes');
const contentType = require('content-type');
const createError = require('http-errors');
const debug = require('debug')('body-parser:json');
const read = require('body-parser/lib/read');
const typeis = require('type-is');
const yamlParser = require('js-yaml');

export function yaml (options: any) {
  const opts = options || {};

  const limit = typeof opts.limit !== 'number'
    ? bytes.parse(opts.limit || '100kb')
    : opts.limit;
  const inflate = opts.inflate !== false;
  const strict = opts.strict !== false;
  const type = opts.type || 'application/x-yaml';
  const verify = opts.verify || false;

  if (verify !== false && typeof verify !== 'function') {
    throw new TypeError('option verify must be function');
  }

  // create the appropriate type checking function
  const shouldParse = typeof type !== 'function'
    ? typeChecker(type)
    : type;

  function parse (body: string) {
    if (body.length === 0) {
      // special-case empty yaml body, as it's a common client-side mistake
      // TODO: maybe make this configurable or part of "strict" option
      return {};
    }

    debug('parse yaml');
    const result = yamlParser.load(body);
    return result;
  }

  return function yamlParser (req: any, res: Response, next: NextFunction) {
    if (req._body) {
      debug('body already parsed');
      next();
      return;
    }

    req.body = req.body || {};

    // skip requests without bodies
    if (!typeis.hasBody(req)) {
      debug('skip empty body');
      next();
      return;
    }

    debug('content-type %j', req.headers['content-type']);

    // determine if request should be parsed
    if (!shouldParse(req)) {
      debug('skip parsing');
      next();
      return;
    }

    // assert charset per RFC 7159 sec 8.1
    const charset = getCharset(req) || 'utf-8';
    if (charset.substr(0, 4) !== 'utf-') {
      debug('invalid charset');
      next(createError(415, 'unsupported charset "' + charset.toUpperCase() + '"', {
        charset
      }));
      return;
    }

    // read
    read(req, res, next, parse, debug, {
      encoding: charset,
      inflate,
      limit,
      verify
    });
  };
}


/**
 * Get the charset of a request.
 *
 * @param {object} req
 * @api private
 */

function getCharset (req: Request) {
  try {
    return contentType.parse(req).parameters.charset.toLowerCase();
  } catch (e) {
    return undefined;
  }
}

/**
 * Get the simple type checker.
 *
 * @param {string} type
 * @return {function}
 */

function typeChecker (type: string) {
  return function checkType (req: Request) {
    return Boolean(typeis(req, type));
  };
}
