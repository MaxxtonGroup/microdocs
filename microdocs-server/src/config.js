/// <reference path="_all.d.ts" />
"use strict";
var yaml_config = require("node-yaml-config");
/**
 * Server configuration
 */
var Config = (function () {
    function Config() {
    }
    /**
     * (re)load the configuration
     */
    Config.reload = function () {
        console.info("load config");
        Config.config = yaml_config.load(Config.configFile);
    };
    /**
     * Get a configuration property
     * @param path path of the property, eg. "foo.bar"
     * @returns {any} the value of the property or undefined
     */
    Config.get = function (path) {
        var paths = path.split('.');
        var current = Config.config;
        for (var i = 0; i < paths.length; ++i) {
            if (current[paths[i]] == undefined) {
                return undefined;
            }
            else {
                current = current[paths[i]];
            }
        }
        return current;
    };
    /**
     * Check if a configuration property exists
     * @param path path of the property, eg. "foo.bar"
     * @returns {boolean} true/false
     */
    Config.has = function (path) {
        return Config.get(path) != undefined;
    };
    /**
     * Location of the config.yml
     * @type {string}
     */
    Config.configFile = __dirname + '/../config.yml';
    return Config;
}());
exports.Config = Config;
// start by loading the configuration
Config.reload();
//# sourceMappingURL=config.js.map