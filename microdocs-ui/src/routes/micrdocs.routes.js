"use strict";
var dashboard_1 = require("./dashboard/dashboard");
/**
 * Created by Reinartz.T on 22-6-2016.
 */
exports.MicrodocsRoutes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard', name: 'Price manager', hidden: true },
    { path: 'dashboard', component: dashboard_1.DashboardRoute, name: 'Price manager', hidden: true }
];
//# sourceMappingURL=micrdocs.routes.js.map