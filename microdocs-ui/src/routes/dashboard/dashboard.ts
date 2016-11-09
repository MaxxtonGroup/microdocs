import {Component} from "@angular/core";

import {COMPONENTS} from "@maxxton/components/components";
import {ProjectTree} from '@maxxton/microdocs-core/domain';
import {DependencyGraph} from '../../panels/dependency-graph/dependency-graph';
import {ProjectService} from "../../services/project.service";
import {Subject} from "rxjs/Subject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Router} from "@angular/router";
import {WelcomePanel} from "../../panels/welcome-panel/welcome.panel";

/**
 * Dashboard route (page that shows the most important information to a user)
 *
 * @author R. Sonke
 */

@Component({
  selector: 'dashboard',
  providers: [],
  templateUrl: 'dashboard.tpl.html',
  directives: [COMPONENTS, DependencyGraph, WelcomePanel]
})

export class DashboardRoute {

  empty:boolean = false;
  nodes:Subject<ProjectTree> = new ReplaySubject<ProjectTree>(1);

  constructor(private projectService:ProjectService, private router:Router){
    this.projectService.getProjects().subscribe(notification => {
      notification.do(data => {
        this.nodes.next(data as ProjectTree);
        if ((data as ProjectTree).projects) {
          this.empty = (data as ProjectTree).projects.length == 0;
        } else {
          this.empty = true;
        }
      });
    });
  }

}