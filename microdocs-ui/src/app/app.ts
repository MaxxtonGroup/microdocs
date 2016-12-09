import {Component, Injectable} from "@angular/core";
import {COMMON_DIRECTIVES} from "@angular/common";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";

import {COMPONENTS} from "@maxxton/components/components";
import {ImageHelperService} from "@maxxton/components/helpers";
import {ProjectTree} from "@maxxton/microdocs-core/domain";

import {DashboardRoute} from "./../routes/dashboard/dashboard";
import {ProjectService} from "./../services/project.service";
import {SidebarComponent} from "../panels/sidebar-panel/sidebar.panel";
import {Subject} from "rxjs/Subject";
import {Notification} from "rxjs/Notification";

/**
 * @application
 * @projectInclude microdocs-core
 */
@Component({
  selector: 'app',
  providers: [],
  directives: [COMMON_DIRECTIVES, ROUTER_DIRECTIVES, COMPONENTS, DashboardRoute, SidebarComponent],
  templateUrl: 'app.tpl.html',
})
@Injectable()
export class App {
  private showFullSideBar:boolean = true;
  private user = {};
  private login = {
    error: <boolean> false,
    status: <number|string> null
  };
  
  projects:Subject<Notification<ProjectTree>>;
  envs:string[];
  selectedEnv:string;
  
  constructor(private image:ImageHelperService, private projectService:ProjectService, private router:Router) {
    this.projects = this.projectService.getProjects();
    
    projectService.getEnvs().subscribe((envs) => {
      this.envs = Object.keys(envs);
      if (projectService.getSelectedEnv() == undefined) {
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
      if (params['env'] && this.projectService.getSelectedEnv() !== params['env']) {
        this.selectedEnv = params['env'];
        this.projectService.setSelectedEnv(params['env']);
      }
    });
  }
  
  public onEnvVersion(newEnv:string) {
    this.projectService.setSelectedEnv(newEnv);
    this.selectedEnv = newEnv;
    
    this.router.navigate(['/dashboard'], {queryParams: {env: newEnv}});
  }
  
  
}
