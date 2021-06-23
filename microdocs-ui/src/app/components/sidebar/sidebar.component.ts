import { Component, HostBinding, Input, Output, EventEmitter } from "@angular/core";
import { Notification } from "rxjs";
import { Observable } from "rxjs";
import { ProjectTree } from "@maxxton/microdocs-core/domain";
import { ProjectService } from "../../services/project.service";
import { environment } from "../../../environments/environment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { RouteInfo } from "../../domain/route-info.model";
import { ImportDialogComponent } from "../import-dialog/import-dialog.component";
import { ExportPanelComponent } from "../export-panel/export-panel.component";

@Component( {
  selector: 'sidebar-component',
  templateUrl: 'sidebar.component.html',
  styleUrls: [ 'sidebar.component.scss' ]
} )

export class SidebarComponent {

  config: any = environment;

  private user = {};

  @HostBinding( 'class.big' )
  private showFullSideBar: boolean = true;


  @Input()
  projects: Observable<Notification<ProjectTree>>;

  menu: Object = [];

  searchQuery: string = '';

  @Input()
  envs: Array<string>;

  @Input()
  selectedEnv: string;

  node: ProjectTree;

  @Output( 'envChange' )
  change = new EventEmitter();

  constructor( private projectService: ProjectService, private snackbar: MatSnackBar, private dialog: MatDialog ) {

  }

  ngOnInit() {
    this.projects.subscribe( notification => {
      notification.do( node => {
        this.node = node;
        this.initMenu();
      } );
    } );
  }

  onEnvVersion( newEnv ) {
    this.change.emit( newEnv );
  }

  onSearchQueryChange( query ) {
    this.searchQuery = query;
    this.initMenu();
  }

  private initMenu() {
    const pathPrefix              = "projects/";
    const menus: Array<RouteInfo> = [ {
      path: '/dashboard',
      pathMatch: 'full',
      pathParams: { env: this.selectedEnv },
      name: 'Overview',
      icon: 'home'
    } ];
    const filteredNodes           = this.filterNodes( this.node, this.searchQuery );
    filteredNodes.projects.forEach( projectNode => {
      let groupName = projectNode.group;
      if ( groupName == undefined ) {
        groupName = "default";
      }
      // add group if it doesn't exists
      if ( menus.filter( group => group.name == groupName ).length == 0 ) {
        menus.push( { name: groupName, icon: 'folder', iconOpen: 'folder_open', children: [], open: true } );
      }
      // add project
      const problems  = projectNode.problems;
      let icon      = null;
      let iconColor = null;
      if ( problems != undefined && problems != null && problems > 0 ) {
        iconColor = 'red';
        icon      = 'error';
      }
      const groupRoute = menus.filter( group => group.name == groupName )[ 0 ];
      groupRoute.children.push( {
        path: pathPrefix + projectNode.title,
        pathParams: { version: projectNode.version, env: this.selectedEnv },
        name: projectNode.title,
        postIcon: icon,
        postIconColor: iconColor,
        generateIcon: true,
        generateIconColor: projectNode.color
      } );
    } );
    console.info( menus );
    this.menu = menus;
  }

  private filterNodes( projectTree: ProjectTree, query: string ): ProjectTree {
    const newNode  = new ProjectTree();
    const keywords = query.split( ' ' );
    projectTree.projects.forEach( projectNode => {
      let hit = true;
      if ( !query || query.trim().length == 0 ) {
        hit = true;
      } else {
        for ( let i = 0; i < keywords.length; i++ ) {
          if ( projectNode.title.toLowerCase().indexOf( keywords[ i ].toLowerCase() ) == -1 ) {
            hit = false;
            if ( projectNode.tags ) {
              projectNode.tags.forEach( tag => {
                if ( tag.toLowerCase().indexOf( keywords[ i ].toLowerCase() ) != -1 ) {
                  hit = true;
                }
              } );
            }
          }
        }
      }
      if ( hit ) {
        newNode.projects.push( projectNode );
      }
    } );
    return newNode;
  }

  doReindex() {
    const time = new Date().getTime();
    const ref  = this.snackbar.open( "Reindexing " + this.projectService.getSelectedEnv() + " environment", undefined, {duration: 3000} );
//    let notification = this.snackbarService.addNotification( "Reindexing " + this.projectService.getSelectedEnv() + " environment", undefined, undefined, 'refresh', undefined );
    this.projectService.reindex().subscribe( resp => {
      ref.dismiss();
      const difTime = new Date().getTime() - time;
      this.snackbar.open( "Reindexing complete in " + difTime + 'ms', undefined, {duration: 3000} );
      this.projectService.refreshProjects();
    }, error => {
      this.snackbar.open( "Reindexing failed!", undefined, {duration: 3000} );
    } );
  }

  showImportModal(): void {
    this.dialog.open( ImportDialogComponent );
  }

  showExportModal(): void {
    this.dialog.open( ExportPanelComponent );
  }

}
