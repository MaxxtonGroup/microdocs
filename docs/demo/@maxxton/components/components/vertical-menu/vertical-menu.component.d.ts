import { Router } from "@angular/router";
import { MenuItemModel } from "./vertical-menu-item.model";
/**
 * A vertical menu based on defined routes
 *
 * @author R. Reinartz (r.reinartz@maxxton.com)
 */
export declare class VerticalMenuComponent {
    private router;
    menu: Array<MenuItemModel>;
    basePath: string;
    constructor(router: Router);
    ngOnInit(): void;
    mainMenu: MenuItemModel[];
    getRouterLink(config: any): string;
    getIcon(config: any): string;
}
