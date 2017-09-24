import { Component } from "@angular/core";

import { ProjectMetadata } from '@maxxton/microdocs-core/domain';
//import {DependencyGraph} from '../../panels/dependency-graph/dependency-graph';
import { ProjectService } from "../../services/project.service";
import { Subject } from "rxjs/Subject";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Router } from "@angular/router";
//import {WelcomePanel} from "../../panels/welcome-panel/welcome.panel";

/**
 * Dashboard route (page that shows the most important information to a user)
 *
 * @author R. Sonke
 */

@Component( {
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: [ 'dashboard.component.scss' ]
} )

export class DashboardComponent {

  loading: boolean                    = true;
  empty: boolean                      = false;
  projects: Subject<ProjectMetadata[]> = new ReplaySubject<ProjectMetadata[]>( 1 );

  constructor( private projectService: ProjectService, private router: Router ) {
    this.projectService.getProjects().subscribe( notification => {
      notification.do( projects => {
        this.loading = false;
        this.projects.next( projects );
        this.empty = projects.length == 0;
      } );
    } );
  }

}
