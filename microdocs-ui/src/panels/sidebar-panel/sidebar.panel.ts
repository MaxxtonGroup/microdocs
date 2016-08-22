/**
 * Created by Reinartz.T on 18-7-2016.
 */
import {Component, HostBinding, Input, Output, EventEmitter} from "@angular/core";
import { ROUTER_DIRECTIVES } from "@angular/router";
import { COMPONENTS } from "@maxxton/components/components";
import {ProjectService} from "../../services/project.service";
import {Observable} from "rxjs";
import {TreeNode} from 'microdocs-core-ts/dist/domain';
import {DashboardRoute} from "../../routes/dashboard/dashboard";

@Component( {
  selector: 'sidebar-component',
  templateUrl: 'sidebar.panel.html',
  directives: [ ROUTER_DIRECTIVES, COMPONENTS ]
} )

export class SidebarComponent {
  private user = {};

  @HostBinding('class.big')
  private showFullSideBar: boolean = true;


  @Input()
  menu:Object = [];

  @Input()
  envs : string[];

  @Input()
  selectedEnv : string;

  @Output('envChange')
  change = new EventEmitter();

  onEnvVersion(newEnv){
    this.change.emit(newEnv);
  }

}