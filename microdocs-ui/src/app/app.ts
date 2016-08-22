import { Component, Injectable } from "@angular/core";
import { COMMON_DIRECTIVES } from "@angular/common";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";

import { COMPONENTS} from "@maxxton/components/components";
import { ImageHelperService } from "@maxxton/components/helpers";
import { TreeNode } from "microdocs-core-ts/dist/domain";

import { DashboardRoute } from "./../routes/dashboard/dashboard";
import { ProjectService } from "./../services/project.service";
import {SidebarComponent} from "../panels/sidebar-panel/sidebar.panel";

@Component( {
  selector: 'app',
  providers: [],
  directives: [ COMMON_DIRECTIVES, ROUTER_DIRECTIVES, COMPONENTS, DashboardRoute, SidebarComponent ],
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

  menu:Object = [];
  envs:string[];
  selectedEnv:string;
  projectSub:any;

  constructor( private image:ImageHelperService, private projectService : ProjectService, private router:Router) {
    this.projectSub = projectService.getProjects().subscribe(node => this.initMenu(node));

    projectService.getEnvs().subscribe((envs) => {
      this.envs = Object.keys(envs);
      if(projectService.getSelectedEnv() == undefined) {
        for (var key in envs) {
          if (envs[key].default) {
            projectService.setSelectedEnv(key);
            this.selectedEnv = key;
            break;
          }
        }
      }
    });

    this.router.routerState.queryParams.subscribe(params => {
      if(params['env'] && this.projectService.getSelectedEnv() !== params['env']){
        this.selectedEnv = params['env'];
        this.projectService.setSelectedEnv(params['env']);
        if(this.projectSub && this.projectSub.unsubscribe){
          this.projectSub.unsubscribe();
        }
        this.projectSub = this.projectService.getProjects().subscribe(node => this.initMenu(node, params['env']));
      }
    });
  }

  public onEnvVersion(newEnv){
    this.projectService.setSelectedEnv(newEnv);
    this.selectedEnv = newEnv;
    if(this.projectSub && this.projectSub.unsubscribe){
      this.projectSub.unsubscribe();
    }
    this.projectSub = this.projectService.getProjects().subscribe(node => this.initMenu(node, newEnv));

    this.router.navigateByUrl('/?env=' + newEnv);
  }

  private initMenu(node:TreeNode, env?:string){
    var pathPrefix = "projects/";
    var pathPostfix = '';
    if(env){
      pathPostfix += '?env=' + env;
    }
    var menus : Array<any> = [{path: '/dashboard', pathMatch: 'full', component: DashboardRoute, name: 'Overview', icon: 'home'}];
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
      var groupRoute = menus.filter(group => group.name == groupName)[0];
      groupRoute.children.push({ path: title, name: title, postIcon: icon});
    }
    this.menu = menus;
  }


}
