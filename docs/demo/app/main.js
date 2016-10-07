"use strict";
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var services_1 = require("@maxxton/components/services");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var common_1 = require("@angular/common");
// import { TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe } from "ng2-translate/ng2-translate";
var helpers_1 = require("@maxxton/components/helpers");
var app_1 = require("./app");
var config_1 = require("./../config/config");
var micrdocs_routes_1 = require("../routes/micrdocs.routes");
var project_service_1 = require("../services/project.service");
if (config_1.MicroDocsConfig.isProduction) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.bootstrap(app_1.App, [
    helpers_1.MXT_HELPERS,
    http_1.HTTP_PROVIDERS,
    services_1.APP_WIDE_SERVICES,
    // TranslateService,
    project_service_1.ProjectService,
    services_1.DummyPreferenceService,
    // provide( PLATFORM_PIPES, { useValue: [ TranslatePipe ], multi: true } ),
    // provide( TranslateLoader, {
    //   useFactory: ( http:Http ) => new TranslateStaticLoader( http, 'assets/i18n', '.json' ),
    //   deps: [ Http ]
    // } ),
    router_1.provideRouter(micrdocs_routes_1.MicrodocsRoutes),
    core_1.provide(common_1.APP_BASE_HREF, { useValue: config_1.MicroDocsConfig.basePath }),
    core_1.provide(common_1.LocationStrategy, { useClass: common_1.HashLocationStrategy })
]).catch(function (err) { return console.error(err); });
