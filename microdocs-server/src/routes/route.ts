/// <reference path="../_all.d.ts" />

import {RequestHandler} from 'express';

/**
 * Base route
 * Adds mapping to the route itself
 */
export class BaseRoute{

    /**
     * The mapping of this route
     */
    protected mapping : RequestMapping;

    /**
     * Path of this route
     * @returns {string}
     */
    public path() : string{
        return this.mapping.path;
    }

    /**
     * List of request methods, eg. ['get', 'post']
     * @returns {string[]}
     */
    public methods() : string[]{
        return this.mapping.methods;
    }

    /**
     * Function which handles the request
     * @returns {RequestHandler}
     */
    public handler() : RequestHandler{
        return this.mapping.handler;
    }

}

interface RequestMapping{

    path : string;
    methods : string[];
    handler : RequestHandler;

}