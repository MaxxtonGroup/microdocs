import { ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { TreeNode } from "microdocs-core-ts/dist/domain";
import { Observable } from "rxjs/Observable";
export declare class DependencyGraph {
    private containerRef;
    private router;
    error: string;
    force: any;
    filteredData: {
        dependencies: {};
    };
    data: TreeNode;
    nodes: Observable<TreeNode>;
    projectName: string;
    env: string;
    constructor(containerRef: ViewContainerRef, router: Router);
    ngOnInit(): void;
    onResize(): void;
    ngAfterViewInit(): void;
    navigate(name: string): void;
    transformData(data: {
        dependencies: {};
    }): {
        nodes: {};
        links: any[];
    };
    chartData(data: {}): void;
}
