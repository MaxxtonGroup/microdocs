import { createExpressServer, useContainer } from "routing-controllers";
import { App } from "@webscale/boot";
import { LoggerFactory } from '@webscale/logging';
import { server } from "../property-keys";
import { Container, Inject } from "typedi";
import * as express from "express";
import * as pathUtil from "path";
import { storage } from "../property-keys";

const logger = LoggerFactory.create();

/**
 * Configure webserver
 */
export class WebConfig {

  constructor() {
    let app = Container.get(App);

    // Init webserver
    useContainer(Container);
    const webServer = createExpressServer({
      defaultErrorHandler: false,
      controllers: [__dirname + "/../controllers/**/*.js"],
      middlewares: [__dirname + "/../middlewares/**/*.js"],
      interceptors: [__dirname + "/../interceptors/**/*.js"]
    });
    let staticFolder = app.properties.getString( storage.staticFolder, "../microdocs-ui/dist" );
    webServer.use(express.static(pathUtil.join(process.cwd(), staticFolder)));

    // Start webserver
    let port = app.properties.getNumber(server.port, 3000);
    logger.info("Listen on port " + port);
    webServer.listen(port);
  }

}