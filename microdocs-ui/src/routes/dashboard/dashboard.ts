import {Component} from "@angular/core";

import {COMPONENTS} from "@maxxton/components/components";
import {TreeNode} from 'microdocs-core-ts/dist/domain';
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
  nodes:Subject<TreeNode> = new ReplaySubject<TreeNode>(1);

  constructor(private projectService:ProjectService, private router:Router){
    this.projectService.getProjects().subscribe(notification => {
      notification.do(data => {
        this.nodes.next(data as TreeNode);
        if ((data as TreeNode).dependencies) {
          this.empty = Object.keys((data as TreeNode).dependencies).length == 0;
        } else {
          this.empty = true;
        }
      });
    });
  }

}