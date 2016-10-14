/// <reference path="_all.d.ts" />
"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as helmet from "helmet";
import * as path from "path";
import * as logger from 'morgan';
import * as middleware from 'swagger-express-middleware';
import * as exphbs from 'express-handlebars';

import {Config} from "./config";
import {BaseRoute} from "./routes/route";
import {ProjectsRoute} from "./routes/projects.route";
import {ProjectRoute} from "./routes/project.route";
import {ReindexRoute} from "./routes/reindex.route";
import {CheckRoute} from "./routes/check.route";
import {PublishRoute} from "./routes/publish.route";
import {EnvRoute} from "./routes/env.route";

/**
 * The MicroDocs server
 * @projectName microdocs-server
 * @projectGroup MicroDocs
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

    //mount view engine
    var viewFolder = "dist/views";
    if (Config.has("viewFolder")) {
      viewFolder = Config.get("viewFolder");
    }
    this.app.engine('handlebars', exphbs());
    this.app.set('views', path.join(__dirname, viewFolder));
    this.app.set('view engine', 'handlebars');

    //add static paths
    var staticFolder = "../microdocs-ui";
    if (Config.has("staticFolder")) {
      staticFolder = Config.get("staticFolder");
    }
    staticFolder.split(";").forEach(folder => {
      console.info("static: " + __dirname + "/../" + folder);
      this.app.use(express.static(path.join(__dirname, '../' + folder)));
    });

    // swagger mock server
    // var self = this;
    // middleware('data/database/address-service/0.1.0.json', this.app, function (err, middleware) {
    //   self.app.use("/mock",
    //     middleware.metadata(),
    //     middleware.parseRequest(),
    //     middleware.validateRequest(),
    //     middleware.mock()
    //   );
    // });
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
      new ProjectRoute(),
      new ReindexRoute(),
      new CheckRoute(),
      new PublishRoute(),
      new EnvRoute()
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

var
  server = Server.bootstrap();
export = server.app;