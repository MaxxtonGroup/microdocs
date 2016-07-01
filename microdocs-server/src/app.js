/// <reference path="_all.d.ts" />
"use strict";
var bodyParser = require("body-parser");
var express = require("express");
var helmet = require("helmet");
var path = require("path");
var config_1 = require("./config");
var projectsRoute = require("./routes/projects.route");
/**
 * The server.
 *
 * @class Server
 */
var Server = (function () {
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    function Server() {
        //create expressjs application
        this.app = express();
        //configure application
        this.config();
        this.routes();
    }
    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    Server.bootstrap = function () {
        return new Server();
    };
    /**
     * Configure application
     *
     * @class Server
     * @method config
     * @return void
     */
    Server.prototype.config = function () {
        //mount logger
        //this.app.use(logger("dev"));
        //mount helmet
        this.app.use(helmet());
        //mount json form parser
        this.app.use(bodyParser.json());
        //mount query string parser
        this.app.use(bodyParser.urlencoded({ extended: true }));
        //add static paths
        var staticFolder = "../microdocs-ui";
        if (config_1.Config.has("staticFolder")) {
            staticFolder = config_1.Config.get("staticFolder");
        }
        console.info("static: " + __dirname + "/../" + staticFolder);
        this.app.use(express.static(path.join(__dirname, '../' + staticFolder)));
    };
    /**
     * Configure routes
     *
     * @class Server
     * @method routes
     * @return void
     */
    Server.prototype.routes = function () {
        //get router
        var router;
        router = express.Router();
        //create routes
        var routes = [
            new projectsRoute.ProjectsRoute()
        ];
        //define basePath
        var basePath = "";
        if (config_1.Config.has('basePath')) {
            basePath = config_1.Config.get('basePath');
        }
        //map routes
        routes.forEach(function (route) {
            route.methods().forEach(function (method) {
                var requestMethod = method.toLowerCase();
                var path = basePath + route.path();
                if (router[requestMethod] == undefined) {
                    throw "unknown request method: " + requestMethod + " for path: " + path;
                }
                console.info("map route: [" + requestMethod + "] " + path);
                router[requestMethod](path, route.handler());
            });
        });
        //use router middleware
        this.app.use(router);
    };
    return Server;
}());
var server = Server.bootstrap();
module.exports = server.app;
//# sourceMappingURL=app.js.map