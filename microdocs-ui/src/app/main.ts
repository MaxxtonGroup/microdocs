import { provide, enableProdMode, PLATFORM_PIPES } from "@angular/core";
import { Http, HTTP_PROVIDERS } from "@angular/http";
import { provideRouter } from "@angular/router";
import { APP_WIDE_SERVICES, PreferenceService} from "@maxxton/components/dist/services";
import { bootstrap } from "@angular/platform-browser-dynamic";
import { APP_BASE_HREF } from "@angular/common";
// import { TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe } from "ng2-translate/ng2-translate";

import { MXT_HELPERS } from "@maxxton/components/dist/helpers";

import { App } from "./app";
import { NewyseConfig } from "./../config/config";
import { MicrodocsRoutes } from "../routes/micrdocs.routes";
import { ProjectService } from "../services/project.service";

if ( NewyseConfig.isProduction ) {
  enableProdMode();
}

bootstrap( App, [
  MXT_HELPERS,
  HTTP_PROVIDERS,
  APP_WIDE_SERVICES,
  // TranslateService,
  ProjectService,
  PreferenceService,
  // provide( PLATFORM_PIPES, { useValue: [ TranslatePipe ], multi: true } ),
  // provide( TranslateLoader, {
  //   useFactory: ( http:Http ) => new TranslateStaticLoader( http, 'assets/i18n', '.json' ),
  //   deps: [ Http ]
  // } ),
  provideRouter( MicrodocsRoutes ),
  provide( APP_BASE_HREF, { useValue: NewyseConfig.basepath } )
] ).catch( err => console.error( err ) );