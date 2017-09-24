import { Component, Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs/Subject";
import { Notification } from "rxjs/Notification";
import { ProjectMetadata } from "@maxxton/microdocs-core/domain";
import { ProjectService } from "./services/project.service";


/**
 * @application
 * @projectInclude microdocs-core
 */
@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ 'app.component.scss' ]
} )
@Injectable()
export class AppComponent {
  private showFullSideBar: boolean = true;
  private user                     = {};
  private login                    = {
    error: <boolean> false,
    status: <number | string> null
  };

  projects: Subject<Notification<ProjectMetadata[]>>;
  envs: string[];
  selectedEnv: string;

  constructor( private projectService: ProjectService, private router: Router, private activatedRoute: ActivatedRoute ) {
    this.projects = projectService.getProjects()
    projectService.getSettings().subscribe( ( settings ) => {
      this.envs = settings.envs.map(env => env.name);
      if ( projectService.getSelectedEnv() == undefined ) {
        settings.envs.forEach( env => {
          if ( env.default ) {
            projectService.setSelectedEnv( env.name );
            this.selectedEnv = env.name;
          }
        } );
      }
    } );


    this.activatedRoute.queryParams.subscribe( params => {
      if ( params[ 'env' ] && this.projectService.getSelectedEnv() !== params[ 'env' ] ) {
        this.selectedEnv = params[ 'env' ];
        this.projectService.setSelectedEnv( params[ 'env' ] );
      }
    } );
  }

  public onEnvChange( newEnv: string ) {
    this.projectService.setSelectedEnv( newEnv );
    this.selectedEnv = newEnv;

    this.router.navigate( [ '/dashboard' ], { queryParams: { env: newEnv } } );
  }


}
