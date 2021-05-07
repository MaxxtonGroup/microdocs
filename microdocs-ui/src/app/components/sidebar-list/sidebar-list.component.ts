import { Component, Input } from "@angular/core";
import { RouteInfo } from "../../domain/route-info.model";

@Component( {
  selector: 'sidebar-list',
  templateUrl: 'sidebar-list.component.html',
  styleUrls: [ 'sidebar-list.component.scss' ]
} )
export class SidebarListComponent {

  constructor() {
  }

  @Input()
  private routes: Array<any>;

  public getIcon( route: RouteInfo ): string {
    if ( route.open ) {
      return route.iconOpen || route.icon;
    } else {
      return route.icon;
    }
  }

  public isLink( route: RouteInfo): boolean {
    return !!(route.path && route.path.trim());
  }

  public toggleRoute(route: RouteInfo): void {
    route.open = !route.open;
  }

  public getColor(route: RouteInfo): string {
    if (route.generateIconColor) {
      return route.generateIconColor;
    }
    return null;
  }

}
