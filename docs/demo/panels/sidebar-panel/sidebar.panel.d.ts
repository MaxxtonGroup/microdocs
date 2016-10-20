/**
 * Created by Reinartz.T on 18-7-2016.
 */
import { EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { TreeNode } from 'microdocs-core-ts/dist/domain';
export declare class SidebarComponent {
    private user;
    private showFullSideBar;
    projects: Observable<TreeNode>;
    menu: Object;
    searchQuery: string;
    envs: string[];
    selectedEnv: string;
    node: TreeNode;
    change: EventEmitter<{}>;
    ngOnInit(): void;
    onEnvVersion(newEnv: any): void;
    onSearchQueryChange(query: any): void;
    private initMenu();
    private filterNodes(node, query);
}
