import { TreeNode } from 'microdocs-core-ts/dist/domain';
import { ProjectService } from "../../services/project.service";
import { Subject } from "rxjs/Subject";
import { Router } from "@angular/router";
/**
 * Dashboard route (page that shows the most important information to a user)
 *
 * @author R. Sonke
 */
export declare class DashboardRoute {
    private projectService;
    private router;
    empty: boolean;
    nodes: Subject<TreeNode>;
    env: string;
    constructor(projectService: ProjectService, router: Router);
    ngOnInit(): void;
    loadProjects(): void;
}
