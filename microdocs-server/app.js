"use strict";
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
class Server {
    constructor() {
        this.app = express();
        this.config();
    }
    static bootstrap() {
        return new Server();
    }
    config() {
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "jade");
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.use(express.static(path.join(__dirname, "bower_components")));
        this.app.use(function (err, req, res, next) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });
    }
}
var server = Server.bootstrap();
module.exports = server.app;
