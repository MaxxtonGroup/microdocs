"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as helmet from "helmet";
import * as path from "path";
import * as exphbs from 'express-handlebars';
import * as multer from 'multer';

import * as logger from './logger'
import {yaml} from "./middelware/yaml-parser";
import {Config} from "./config";
import {BaseRoute} from "./routes/route";
import {ProjectsRoute} from "./routes/projects.route";
import {ProjectRoute} from "./routes/project.route";
import {ReindexRoute} from "./routes/reindex.route";
import {CheckRoute} from "./routes/check.route";
import { PublishRoute, PublishZipRoute } from "./routes/publish.route";
import {EnvRoute} from "./routes/env.route";
import {Request, Response, NextFunction} from "express";
import {DefaultInjectionConfig, Injection} from "./injections";
import {RemoveProjectRoute} from "./routes/remove-project.route";
import {EditProjectRoute} from "./routes/edit-project.route";

/**
 * The MicroDocs server
 * @application microdocs-server
 * @projectGroup MicroDocs
 * @projectInclude @maxxton/microdocs-core
 * @class Server
 */
class Server {
  
  public app:express.Application;
  private upload:any;
  
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
  constructor(private injection:Injection = new Injection()) {
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
    // this.app.use(logger);
    
    //mount helmet
    this.app.use(helmet());

    //mount custom parser
    this.app.use(yaml({
      limit: '1mb',
    }));
    
    // mount json form parser
    this.app.use(bodyParser.json({
      limit: '1mb'
    }));
    
    //mount query string parser
    this.app.use(bodyParser.urlencoded({extended: true}));
    
    //mount view engine
    var viewFolder = "dist/views";
    if (Config.has("viewFolder")) {
      viewFolder = Config.get("viewFolder");
    }
    var dataFolder = '../' + Config.get("dataFolder") + "/config/templates";
    this.app.engine('handlebars', exphbs());
    this.app.set('views', path.join(__dirname, viewFolder));
    this.app.set('view engine', 'handlebars');
    this.upload = multer({ dest: Config.get('tempFolder') });
    
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
    let router:any;
    router = express.Router();
    
    //create routes
    var routes:BaseRoute[] = [
      new ProjectsRoute(this.injection),
      new ProjectRoute(this.injection),
      new ReindexRoute(this.injection),
      new CheckRoute(this.injection),
      new PublishRoute(this.injection),
      new PublishZipRoute(this.injection),
      new EnvRoute(this.injection),
      new RemoveProjectRoute(this.injection),
      new EditProjectRoute(this.injection)
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
        if (!router[requestMethod]) {
          throw "unknown request method: " + requestMethod + " for path: " + path;
        }
        console.info("map route: [" + requestMethod + "] " + path);
        if(route.upload()){
          router[requestMethod](path, this.upload.single('upload'), (req:Request, res:Response, next:NextFunction) => route.handler()(req, res, next, route));
        }else{
          router[requestMethod](path, (req:Request, res:Response, next:NextFunction) => route.handler()(req, res, next, route));
        }
      });
    });
    
    //use router middleware
    this.app.use(router);
  }
}

const app = Server.bootstrap().app;
export = app;