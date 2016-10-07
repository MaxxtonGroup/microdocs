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
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const domain_1 = require("microdocs-core-ts/dist/domain");
const config_1 = require("../config/config");
const schema_helper_1 = require("microdocs-core-ts/dist/helpers/schema/schema.helper");
let ProjectService = class ProjectService {
    constructor(http) {
        this.http = http;
    }
    getProjects(env) {
        if (env == undefined) {
            env = this.getSelectedEnv();
        }
        if (env) {
            return this.http.get(this.getApiUrl('/projects', { env: env })).map(resp => {
                var json = resp.json();
                return domain_1.TreeNode.link(json);
            });
        }
        return null;
    }
    getProject(name, version, env) {
        if (env == undefined) {
            env = this.getSelectedEnv();
        }
        return this.http.get(this.getApiUrl('/projects/' + name, { version: version, env: env })).map(resp => {
            var json = resp.json();
            // resolve references
            var resolvedJson = schema_helper_1.SchemaHelper.resolveObject(json);
            return resolvedJson;
        });
    }
    setSelectedEnv(env) {
        this.env = env;
    }
    getSelectedEnv() {
        return this.env;
    }
    getEnvs() {
        return this.http.get(this.getApiUrl("/envs")).map(resp => resp.json());
    }
    getApiUrl(path, params) {
        var fullPath = config_1.MicroDocsConfig.apiPath + path;
        if (config_1.MicroDocsConfig.isStandAlone) {
            if (params) {
                Object.keys(params).sort().filter(key => params[key]).forEach(key => fullPath += "-" + params[key]);
            }
            fullPath += '.json';
        }
        else {
            if (params) {
                var first = true;
                Object.keys(params).sort().filter(key => params[key]).forEach(key => {
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
    }
};
ProjectService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [http_1.Http])
], ProjectService);
exports.ProjectService = ProjectService;
