import { Component, Injectable } from "@angular/core";
import { COMMON_DIRECTIVES } from "@angular/common";
import { ROUTER_DIRECTIVES } from "@angular/router";

import { COMPONENTS } from "@maxxton/components/dist/components";
import { MenuItemModel } from "@maxxton/components/dist/components/vertical-menu/vertical-menu-item.model";
import { ImageHelperService } from "@maxxton/components/dist/helpers";
import { TreeNode } from "microdocs-core-ts/dist/domain";

import { DashboardRoute } from "./../routes/dashboard/dashboard";
import { ProjectService } from "./../services/project.service";

@Component( {
  selector: 'app',
  providers: [],
  directives: [ COMMON_DIRECTIVES, ROUTER_DIRECTIVES, COMPONENTS, DashboardRoute ],
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

  constructor( private image:ImageHelperService, private projectService : ProjectService) {
    projectService.getProjects().subscribe(node => this.initMenu(node));
  }

  private initMenu(node:TreeNode){
    var pathPrefix = "projects/";
    var menus : Array<any> = [{path: 'dashboard', component: DashboardRoute, name: 'Overview', icon: 'home'}];
    for(var title in node.dependencies){
      var groupName = node.dependencies[title].group;
      if(groupName == undefined){
        groupName = "default";
      }
      // add group if it doesn't exists
      if(menus.filter(group => group.path == pathPrefix + groupName).length == 0){
        menus.push({ path: pathPrefix + groupName, name: groupName, icon: 'memory', inactive: true, children: []});
      }
      // add project
      var problems = node.dependencies[title].problems;
      var icon = null;
      if(problems != undefined && problems != null && problems > 0){
        icon = 'error';
      }
      menus.filter(group => group.name == groupName)[0].children.push({ path: title, name: title, postIcon: icon});
    }
    this.menu = menus;
  }
}
