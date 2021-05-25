#!/usr/bin/env node
"use strict";

/**
 * @author Steven Hermans
 */

let config = require("./config");
let app = require("./app");
let http = require("http");

// get port from environment and store in Express.
let port = normalizePort(process.env.PORT || config.port || 8000);
app.set("port", port);

// create http server
let server = http.createServer(app);

// listen on provided ports
server.listen(port);

// add error handler
server.on("error", onError);

// start listening on port
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: any) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            //break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            //break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    console.info("Listening on " + bind);
}
