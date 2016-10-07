import { QueryList } from "@angular/core";
import { TabComponent } from "./tab.component";
export declare class TabsComponent {
    private tabComponents;
    secondary: string;
    vertical: string;
    tabs: TabComponent[];
    constructor(tabComponents: QueryList<TabComponent>);
    getClass(): string;
    getContainerClass(): string;
    getContentClass(): string;
    selectTab(tab: TabComponent): void;
    getActiveTab(): TabComponent;
    addTab(tab: TabComponent): void;
}
export declare const TABS_DIRECTIVES: any[];
