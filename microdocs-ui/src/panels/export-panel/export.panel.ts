import { Component, EventEmitter, Output, Input } from "@angular/core";
import { COMPONENTS } from "@maxxton/components/components";
import { Observable } from "rxjs/Observable";
import { ProjectNode } from "@maxxton/microdocs-core/domain";
import { ProjectService } from "../../services/project.service";

/**
 * @author Steven Hermans
 */
@Component( {
  selector: 'export-panel',
  templateUrl: 'export.panel.html',
  directives: [ COMPONENTS ]
} )
export class ExportPanel {

  @Input()
  showModal:boolean     = false;
  @Input( "project" )
  defaultProject:string = null;
  @Input( "version" )
  defaultVersion:string = null;

  @Output()
  stateChanges:EventEmitter = new EventEmitter();

  allSelected:boolean = true;
  groupItems:Item[]   = [];
  projectItems:Item[] = [];
  format:string       = 'microdocs';
  error:string        = '';
  warning:string      = '';

  constructor( private projectService:ProjectService ) {
    projectService.getProjects().subscribe( notification => {
      notification.do( projectTree => {
        this.allSelected  = true;
        this.groupItems   = [];
        this.projectItems = [];
        if ( projectTree.projects ) {
          projectTree.projects.forEach( projectNode => {
            if ( projectNode.group && projectNode.group.length > 0 ) {
              this.projectItems.push( new Item( projectNode.title, projectNode.group ) );
              if ( this.groupItems.filter( group => group.name.toLowerCase() === projectNode.group.toLowerCase() ).length == 0 ) {
                this.groupItems.push( new Item( projectNode.group ) );
              }
            }
          } );
        }
      } );
    } );
  }

  public setOpened( state:boolean ) {
    this.showModal = state;
    this.stateChanges.emit( state );
    if ( state ) {
      this.warning = '';
      this.error   = '';
      this.format  = "microdocs";
      if ( this.defaultProject ) {
        this.selectAll( false );
        this.projectItems.filter( p => p.name.toLowerCase() === this.defaultProject.toLowerCase() ).forEach( p => p.selected = true );
      } else {
        this.selectAll( true );
      }
    }
  }

  selectAll( selected:boolean ) {
    this.groupItems.forEach( item => item.selected = selected );
    this.projectItems.forEach( item => item.selected = selected );
    this.allSelected = selected;
  }

  selectItem( item:Item, selected:boolean ) {
    item.selected = selected;
    if ( item.isGroup() ) {
      this.projectItems.filter( i => i.group === item.name ).forEach( i => i.selected = selected );
    } else {
      var gItems = this.groupItems.filter( g => item.group === g.name );
      if ( gItems.length >= 1 ) {
        var gItem = gItems[ 0 ];
        var items = this.projectItems.filter( i => i.group === gItem.name );
        if ( items.filter( i => !i.selected ).length == 0 ) {
          gItem.selected = true;
        } else {
          gItem.selected = false;
        }
      }
    }
    this.allSelected = this.projectItems.filter( p => !p.selected ).length == 0;
    if ( this.defaultVersion && this.defaultProject ) {
      this.warning         = '';
      var filteredProjects = this.projectItems.filter( p => p.name.toLowerCase() !== this.defaultProject.toLowerCase() && p.selected );
      if ( filteredProjects.length > 0 ) {
        this.warning = "When you select a different project than '" + this.defaultProject + "' the latest version(s) will be used";
      }
    }
  }

  selectFormat( format:string ) {
    this.format = format;
  }

  export() {
    var selectedProjects = this.projectItems.filter( item => item.selected );
    if ( selectedProjects.length == 0 ) {
      this.error = "No projects selected";
    } else {
      var exportUrl = "/api/v1/projects";
      if ( selectedProjects.length == 1 ) {
        var selectedProject = selectedProjects[ 0 ];
        exportUrl += '/' + encodeURIComponent( selectedProject.name ) + "?export=" + encodeURIComponent( this.format );
        if ( this.defaultVersion && this.defaultProject.toLowerCase() === selectedProject.name.toLowerCase() ) {
          exportUrl += "&version=" + encodeURIComponent( this.defaultVersion );
        }
      } else {
        exportUrl += "?export=" + encodeURIComponent( this.format );
        if ( !this.allSelected ) {
          var groups = this.groupItems.filter( item => item.selected );
          if ( groups.length > 0 ) {
            var groupQuery = "&groups=";
            groups.forEach( ( group, index ) => {
              if ( index == 0 ) {
                groupQuery += encodeURIComponent( group.name );
              } else {
                groupQuery += ',' + encodeURIComponent( group.name );
              }
            } );
            exportUrl += groupQuery;
          }
          var projectsRemaining = this.projectItems.filter( item => item.selected && groups.filter( g => g.name === item.group ).length == 0 );
          if ( projectsRemaining.length > 0 ) {
            var projectQuery = "&projects=";
            projectsRemaining.forEach( ( project, index ) => {
              if ( index == 0 ) {
                projectQuery += encodeURIComponent( project.name );
              } else {
                projectQuery += ',' + encodeURIComponent( project.name );
              }
            } );
            exportUrl += projectQuery;
          }
        }
      }
      exportUrl += '&env=' + this.projectService.getSelectedEnv();
      window.open( exportUrl, '_blank' );
      this.setOpened( false );
    }
  }
}

export class Item {

  public selected:boolean = true;

  constructor( public name:string, public group:string = null ) {

  }

  public isGroup() {
    return this.group == null;
  }

}