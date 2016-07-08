import { Component, Injectable } from "@angular/core";
import { COMMON_DIRECTIVES } from "@angular/common";
import { ROUTER_DIRECTIVES } from "@angular/router";

import { COMPONENTS } from "angular-frontend-mxt/dist/components";
import { MenuItemModel } from "angular-frontend-mxt/dist/components/vertical-menu/vertical-menu-item.model";
import { ImageHelperService } from "angular-frontend-mxt/dist/helpers";
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
    var groups : Array<any> = [];
    for(var title in node.dependencies){
      var groupName = node.dependencies[title].group;
      if(groupName == undefined){
        groupName = "default";
      }
      if(groups.filter(group => group.path == pathPrefix + groupName).length == 0){
        groups.push({ path: pathPrefix + groupName, name: groupName, inactive: true, children: []});
      }
      groups.filter(group => group.name == groupName)[0]
          .children.push({ path: title, name: title});
    }
    this.menu = groups;
  }
}
