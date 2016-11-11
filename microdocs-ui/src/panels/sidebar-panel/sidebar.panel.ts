/**
 * Created by Reinartz.T on 18-7-2016.
 */
import {Component, HostBinding, Input, Output, EventEmitter} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {COMPONENTS} from "@maxxton/components/components";
import {Notification} from "rxjs/Notification";
import {Observable} from "rxjs/Observable";
import {ProjectTree} from '@maxxton/microdocs-core/domain';
import {DashboardRoute} from "../../routes/dashboard/dashboard";
import {ImportPanel} from "../import-panel/import.panel";
import {ExportPanel} from "../export-panel/export.panel";
import {MicroDocsConfig} from '../../config/config';

@Component({
  selector: 'sidebar-component',
  templateUrl: 'sidebar.panel.html',
  directives: [ROUTER_DIRECTIVES, COMPONENTS, ImportPanel, ExportPanel]
})

export class SidebarComponent {
  
  config = MicroDocsConfig;
  
  private user = {};
  showImportModal = false;
  showExportModal = false;
  showSettingsModal = false;
  
  @HostBinding('class.big')
  private showFullSideBar:boolean = true;
  
  
  @Input()
  projects:Observable<Notification<ProjectTree>>;
  
  menu:Object = [];
  
  searchQuery:string = '';
  
  @Input()
  envs:string[];
  
  @Input()
  selectedEnv:string;
  
  node:ProjectTree;
  
  @Output('envChange')
  change = new EventEmitter();
  
  ngOnInit() {
    this.projects.subscribe(notification => {
      notification.do(node => {
        this.node = node;
        this.initMenu()
      });
    });
  }
  
  onEnvVersion(newEnv) {
    this.change.emit(newEnv);
  }
  
  onSearchQueryChange(query) {
    this.searchQuery = query;
    this.initMenu();
  }
  
  private initMenu() {
    var pathPrefix = "projects/";
    var menus:Array<any> = [{
      path: '/dashboard',
      pathMatch: 'full',
      pathParams: {env: this.selectedEnv},
      component: DashboardRoute,
      name: 'Overview',
      icon: 'home'
    }];
    var filteredNodes = this.filterNodes(this.node, this.searchQuery);
    filteredNodes.projects.forEach(projectNode => {
      var groupName = projectNode.group;
      if (groupName == undefined) {
        groupName = "default";
      }
      // add group if it doesn't exists
      if (menus.filter(group => group.name == groupName).length == 0) {
        menus.push({name: groupName, icon: 'folder', iconOpen: 'folder_open', inactive: true, children: [], childrenVisible: true});
      }
      // add project
      var problems = projectNode.problems;
      var icon = null;
      var iconColor = 'red';
      if (problems != undefined && problems != null && problems > 0) {
        icon = 'error';
      }
      var groupRoute = menus.filter(group => group.name == groupName)[0];
      groupRoute.children.push({
        path: pathPrefix + projectNode.title,
        pathParams: {version: projectNode.version, env: this.selectedEnv},
        name: projectNode.title,
        postIcon: icon,
        postIconColor: iconColor,
        generateIcon: true
      });
    });
    console.info(menus);
    this.menu = menus;
  }
  
  private filterNodes(projectTree:ProjectTree, query:string):ProjectTree {
    var newNode = new ProjectTree();
    var keywords = query.split(' ');
    projectTree.projects.forEach(projectNode => {
      var hit = true;
      if (!query || query.trim().length == 0) {
        hit = true;
      } else {
        for (var i = 0; i < keywords.length; i++) {
          if(projectNode.title.toLowerCase().indexOf(keywords[i].toLowerCase()) == -1) {
            hit = false;
            if (projectNode.tags) {
              projectNode.tags.forEach(tag => {
                if (tag.toLowerCase().indexOf(keywords[i].toLowerCase()) != -1) {
                  hit = true;
                }
              });
            }
          }
        }
      }
      if (hit) {
        newNode.projects.push(projectNode);
      }
    });
    return newNode;
  }
  
}