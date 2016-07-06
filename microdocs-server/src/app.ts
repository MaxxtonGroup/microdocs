/// <reference path="_all.d.ts" />
"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as helmet from "helmet";
import * as path from "path";
import * as logger from 'morgan';

import {Config} from "./config";
import {BaseRoute} from "./routes/route";
import {ProjectsRoute} from "./routes/projects.route";
import {ReindexRoute} from "./routes/reindex.route";

/**
 * The server.
 *
 * @class Server
 */
class Server {

    public app:express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap():Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();
        this.routes();
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     * @return void
     */
    private config() {
        //mount logger
        // this.app.use(logger("logs/logfile.txt"));

        //mount helmet
        this.app.use(helmet());

        //mount json form parser
        this.app.use(bodyParser.json());

        //mount query string parser
        this.app.use(bodyParser.urlencoded({extended: true}));

        //add static paths
        var staticFolder = "../microdocs-ui";
        if (Config.has("staticFolder")) {
            staticFolder = Config.get("staticFolder");
        }
        console.info("static: " + __dirname + "/../" + staticFolder);
        this.app.use(express.static(path.join(__dirname, '../' + staticFolder)));
    }

    /**
     * Configure routes
     *
     * @class Server
     * @method routes
     * @return void
     */
    private routes() {
        //get router
        let router:express.Router;
        router = express.Router();

        //create routes
        var routes:BaseRoute[] = [
            new ProjectsRoute(),
            new ReindexRoute()
        ];

        //define basePath
        var basePath = "";
        if (Config.has('basePath')) {
            basePath = Config.get('basePath');
        }

        //map routes
        routes.forEach((route) => {
            route.methods().forEach((method) => {
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
    }
}

var server = Server.bootstrap();
export = server.app;