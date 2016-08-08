/**
 * Created by Reinartz.T on 18-7-2016.
 */
import { Component, HostBinding, Input } from "@angular/core";
import { ROUTER_DIRECTIVES } from "@angular/router";
import { COMPONENTS } from "@maxxton/components/components";

@Component( {
  selector: 'sidebar-component',
  templateUrl: 'sidebar.panel.html',
  directives: [ ROUTER_DIRECTIVES, COMPONENTS ]
} )

export class SidebarComponent {
  private user = {};

  @Input()
  customMenu:Object;

  @HostBinding('class.big')
  private showFullSideBar: boolean = true;

}