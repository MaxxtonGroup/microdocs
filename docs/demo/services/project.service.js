"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var domain_1 = require("microdocs-core-ts/dist/domain");
var config_1 = require("../config/config");
var schema_helper_1 = require("microdocs-core-ts/dist/helpers/schema/schema.helper");
var ProjectService = (function () {
    function ProjectService(http) {
        this.http = http;
    }
    ProjectService.prototype.getProjects = function (env) {
        if (env == undefined) {
            env = this.getSelectedEnv();
        }
        if (env) {
            return this.http.get(this.getApiUrl('/projects', { env: env })).map(function (resp) {
                var json = resp.json();
                return domain_1.TreeNode.link(json);
            });
        }
        return null;
    };
    ProjectService.prototype.getProject = function (name, version, env) {
        if (env == undefined) {
            env = this.getSelectedEnv();
        }
        return this.http.get(this.getApiUrl('/projects/' + name, { version: version, env: env })).map(function (resp) {
            var json = resp.json();
            // resolve references
            var resolvedJson = schema_helper_1.SchemaHelper.resolveObject(json);
            return resolvedJson;
        });
    };
    ProjectService.prototype.setSelectedEnv = function (env) {
        this.env = env;
    };
    ProjectService.prototype.getSelectedEnv = function () {
        return this.env;
    };
    ProjectService.prototype.getEnvs = function () {
        return this.http.get(this.getApiUrl("/envs")).map(function (resp) { return resp.json(); });
    };
    ProjectService.prototype.getApiUrl = function (path, params) {
        var fullPath = config_1.MicroDocsConfig.apiPath + path;
        if (config_1.MicroDocsConfig.isStandAlone) {
            if (params) {
                Object.keys(params).sort().filter(function (key) { return params[key]; }).forEach(function (key) { return fullPath += "-" + params[key]; });
            }
            fullPath += '.json';
        }
        else {
            if (params) {
                var first = true;
                Object.keys(params).sort().filter(function (key) { return params[key]; }).forEach(function (key) {
                    if (first) {
                        first = false;
                        fullPath += "?" + key + '=' + params[key];
                    }
                    else {
                        fullPath += "&" + key + '=' + params[key];
                    }
                });
            }
        }
        return fullPath;
    };
    ProjectService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ProjectService);
    return ProjectService;
}());
exports.ProjectService = ProjectService;
