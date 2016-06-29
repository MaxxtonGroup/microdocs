/// <reference path="../_all.d.ts" />
"use strict";
/**
 * Base route
 * Adds mapping to the route itself
 */
var BaseRoute = (function () {
    function BaseRoute() {
    }
    /**
     * Path of this route
     * @returns {string}
     */
    BaseRoute.prototype.path = function () {
        return this.mapping.path;
    };
    /**
     * List of request methods, eg. ['get', 'post']
     * @returns {string[]}
     */
    BaseRoute.prototype.methods = function () {
        return this.mapping.methods;
    };
    /**
     * Function which handles the request
     * @returns {RequestHandler}
     */
    BaseRoute.prototype.handler = function () {
        return this.mapping.handler;
    };
    return BaseRoute;
}());
exports.BaseRoute = BaseRoute;
//# sourceMappingURL=route.js.map