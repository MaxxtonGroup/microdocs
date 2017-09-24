import { Component, HostBinding, Input, Output, EventEmitter } from "@angular/core";
import { Notification } from "rxjs/Notification";
import { Observable } from "rxjs/Observable";
import { ProjectMetadata } from "@maxxton/microdocs-core/domain";
import { ProjectService } from "../../services/project.service";
import { environment } from "../../../environments/environment";
import { MdSnackBar, MdDialog } from "@angular/material";
import { RouteInfo } from "../../domain/route-info.model";
//import { ImportDialogComponent } from "../import-dialog/import-dialog.component";
//import { ExportPanelComponent } from "../export-panel/export-panel.component";

@Component( {
  selector: 'sidebar-component',
  templateUrl: 'sidebar.component.html',
  styleUrls: [ 'sidebar.component.scss' ]
} )

export class SidebarComponent {

  private config: any = environment;

  private user = {};

  @HostBinding( 'class.big' )
  private showFullSideBar: boolean = true;


  @Input()
  projects: Observable<Notification<ProjectMetadata[]>>;

  menu: Object = [];

  searchQuery: string = '';

  @Input()
  envs: string[];

  @Input()
  selectedEnv: string;

  projectList: ProjectMetadata[];

  @Output( 'envChange' )
  change = new EventEmitter();

  constructor( private projectService: ProjectService, private snackbar: MdSnackBar, private dialog: MdDialog ) {

  }

  ngOnInit() {
    this.projects.subscribe( notification => {
      notification.do( projectList => {
        this.projectList = projectList;
        this.initMenu()
      } );
    } );
  }

  onEnvChange( newEnv ) {
    this.change.emit( newEnv );
  }

  onSearchQueryChange( query ) {
    this.searchQuery = query;
    this.initMenu();
  }

  private initMenu() {
    let pathPrefix              = "projects/";
    let menus: Array<RouteInfo> = [ {
      path: '/dashboard',
      pathMatch: 'full',
      pathParams: { env: this.selectedEnv },
      name: 'Overview',
      icon: 'home'
    } ];
    let filteredProjects           = this.filterProjects( this.projectList, this.searchQuery );
    filteredProjects.forEach( project => {
      let groupName = project.group;
      if ( groupName == undefined ) {
        groupName = "default";
      }
      // add group if it doesn't exists
      if ( menus.filter( group => group.name == groupName ).length == 0 ) {
        menus.push( { name: groupName, icon: 'folder', iconOpen: 'folder_open', children: [], open: true } );
      }
      // add project
      let problems  = project.problems;
      let icon      = null;
      let iconColor = null;
      if ( problems != undefined && problems != null && problems > 0 ) {
        iconColor = 'red';
        icon      = 'error';
      }
      let groupRoute = menus.filter( group => group.name == groupName )[ 0 ];
      groupRoute.children.push( {
        path: pathPrefix + project.title,
        pathParams: { env: this.selectedEnv },
        name: project.title,
        postIcon: icon,
        postIconColor: iconColor,
        generateIcon: true,
        generateIconColor: project.color
      } );
    } );
    this.menu = menus;
  }

  private filterProjects( projects: ProjectMetadata[], query: string ): ProjectMetadata[] {
    let newProjects:ProjectMetadata[] = [];
    let keywords = query.split( ' ' );
    projects.forEach( project => {
      let hit = true;
      if ( !query || query.trim().length == 0 ) {
        hit = true;
      } else {
        for ( let i = 0; i < keywords.length; i++ ) {
          if ( project.title.toLowerCase().indexOf( keywords[ i ].toLowerCase() ) == -1 ) {
            hit = false;
            if ( project.searchTags ) {
              project.searchTags.forEach( tag => {
                if ( tag.toLowerCase().indexOf( keywords[ i ].toLowerCase() ) != -1 ) {
                  hit = true;
                }
              } );
            }
          }
        }
      }
      if ( hit ) {
        newProjects.push( project );
      }
    } );
    return newProjects;
  }

  doReindex() {
    let time = new Date().getTime();
    let ref  = this.snackbar.open( "Reindexing " + this.projectService.getSelectedEnv() + " environment", undefined, {duration: 3000} );
//    let notification = this.snackbarService.addNotification( "Reindexing " + this.projectService.getSelectedEnv() + " environment", undefined, undefined, 'refresh', undefined );
    this.projectService.reindex().subscribe( resp => {
      ref.dismiss();
      let difTime = new Date().getTime() - time;
      this.snackbar.open( "Reindexing complete in " + difTime + 'ms', undefined, {duration: 3000} );
      this.projectService.refreshProjects();
    }, error => {
      this.snackbar.open( "Reindexing failed!", undefined, {duration: 3000} );
    } );
  }

  showImportModal(): void {
//    this.dialog.open( ImportDialogComponent );
  }

  showExportModal(): void {
//    this.dialog.open( ExportPanelComponent );
  }

}
