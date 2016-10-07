"use strict";
const dashboard_1 = require("./dashboard/dashboard");
const group_route_1 = require("./group/group.route");
const project_route_1 = require("./project/project.route");
/**
 * Created by Reinartz.T on 22-6-2016.
 */
exports.MicrodocsRoutes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard', name: 'MicroDocs', hidden: true },
    { path: 'dashboard', component: dashboard_1.DashboardRoute, name: 'MicroDocs', hidden: true },
    { path: 'projects/:group', component: group_route_1.GroupRoute, name: 'Group', hidden: true, children: [
            { path: ':project', component: project_route_1.ProjectRoute, name: 'Project', hidden: true }
        ] },
];
