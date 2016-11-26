import { provide, enableProdMode, PLATFORM_PIPES } from "@angular/core";
import { Http, HTTP_PROVIDERS } from "@angular/http";
import { provideRouter } from "@angular/router";
import { APP_WIDE_SERVICES, DummyPreferenceService, SnackbarService} from "@maxxton/components/services";
import { bootstrap } from "@angular/platform-browser-dynamic";
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from "@angular/common";
// import { TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe } from "ng2-translate/ng2-translate";

import { MXT_HELPERS } from "@maxxton/components/helpers";

import { App } from "./app";
import { MicroDocsConfig } from "./../config/config";
import { MicrodocsRoutes } from "../routes/micrdocs.routes";
import { ProjectService } from "../services/project.service";
import { RestProjectClient } from "../services/rest-project.client";
import { StandaloneProjectClient } from "../services/standalone-project.client";

if ( MicroDocsConfig.isProduction ) {
  enableProdMode();
}

bootstrap( App, [
  MXT_HELPERS,
  HTTP_PROVIDERS,
  APP_WIDE_SERVICES,
  // TranslateService,
  provide('ProjectClient', {useClass: MicroDocsConfig.isStandAlone ? StandaloneProjectClient : RestProjectClient}),
  ProjectService,
  DummyPreferenceService,
  SnackbarService,
  // provide( PLATFORM_PIPES, { useValue: [ TranslatePipe ], multi: true } ),
  // provide( TranslateLoader, {
  //   useFactory: ( http:Http ) => new TranslateStaticLoader( http, 'assets/i18n', '.json' ),
  //   deps: [ Http ]
  // } ),
  provideRouter( MicrodocsRoutes ),
  provide( APP_BASE_HREF, { useValue: MicroDocsConfig.basepath } ),
  provide(LocationStrategy, {useClass: HashLocationStrategy})
] ).catch( err => console.error( err ) );