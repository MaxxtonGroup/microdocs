import { createExpressServer, useContainer } from "routing-controllers";
import { App } from "@webscale/boot";
import { LoggerFactory } from '@webscale/logging';
import { ProjectController } from "../controllers/project.controller";
import { server } from "../property-keys";
import { SettingsController } from "../controllers/settings.controller";
import { Container, Inject } from "typedi";

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
      middlewares: [__dirname + "/../middlewares/**/*.js"]
    });

    // Start webserver
    let port = app.properties.getNumber(server.port, 3000);
    logger.info("Listen on port " + port);
    webServer.listen(port);
  }

}