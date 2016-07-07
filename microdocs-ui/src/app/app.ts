import { Component, Injectable } from "@angular/core";
import { COMMON_DIRECTIVES } from "@angular/common";
import { ROUTER_DIRECTIVES } from "@angular/router";
import { DashboardRoute } from "./../routes/dashboard/dashboard";
import { COMPONENTS } from "angular-frontend-mxt/dist/components";
import { MenuItemModel } from "angular-frontend-mxt/dist/components/vertical-menu/vertical-menu-item.model";
import { ImageHelperService } from "angular-frontend-mxt/dist/helpers";

@Component( {
  selector: 'app',
  providers: [],
  directives: [ COMMON_DIRECTIVES, ROUTER_DIRECTIVES, COMPONENTS, DashboardRoute, ROUTER_DIRECTIVES ],
  templateUrl: 'app.tpl.html',
} )
@Injectable()
export class App {
  private showFullSideBar:boolean = true;
  private user = {};
  private login = {
    error: <boolean> false,
    status: <number|string> null
  };

  private menu:Array<MenuItemModel> = [];

  constructor( private image:ImageHelperService ) {

  }
}
