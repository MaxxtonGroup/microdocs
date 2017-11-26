
import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import * as logger from "winston";

const proxy = require("express-request-proxy");

logger.configure({
  level: "debug",
  transports: [
    new (logger.transports.Console)()
  ]
});

// Init webserver
const webServer = createExpressServer({
  defaultErrorHandler: false,
  controllers: [__dirname + "/controllers/**/*.js"],
  middlewares: [__dirname + "/middlewares/**/*.js"],
  // interceptors: [__dirname + "/../interceptors/**/*.js"]
});

webServer.get("/*", proxy({
  url: "http://localhost:4200/*"
}));

// Start webserver
const port = 3000;
logger.info("Listen on port " + port);
webServer.listen(port);
