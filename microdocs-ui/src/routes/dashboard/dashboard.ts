import {Component} from "@angular/core";

import {COMPONENTS} from "@maxxton/components/components";
import {TreeNode} from 'microdocs-core-ts/dist/domain';
import {DependencyGraph} from '../../panels/dependency-graph/dependency-graph';
import {ProjectService} from "../../services/project.service";
import {Subject} from "rxjs/Subject";

/**
 * Dashboard route (page that shows the most important information to a user)
 *
 * @author R. Sonke
 */

@Component({
  selector: 'dashboard',
  providers: [],
  templateUrl: 'dashboard.tpl.html',
  directives: [COMPONENTS, DependencyGraph]
})

export class DashboardRoute {

  nodes:Subject<TreeNode> = new Subject();

  constructor(private projectService:ProjectService){}

  ngOnInit(){
    this.projectService.getProjects().subscribe((data => this.nodes.next(data as TreeNode)));
  }

}