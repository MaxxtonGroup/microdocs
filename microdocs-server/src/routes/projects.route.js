/// <reference path="../_all.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var route_1 = require("./route");
var ProjectsRoute = (function (_super) {
    __extends(ProjectsRoute, _super);
    function ProjectsRoute() {
        _super.apply(this, arguments);
        this.mapping = { methods: ['get'], path: '/projects', handler: this.projects };
    }
    ProjectsRoute.prototype.projects = function (req, res, next) {
        res.jsonp({ message: "hello" });
    };
    return ProjectsRoute;
}(route_1.BaseRoute));
exports.ProjectsRoute = ProjectsRoute;
//# sourceMappingURL=projects.route.js.map