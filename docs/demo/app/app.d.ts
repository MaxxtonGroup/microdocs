import { Router } from "@angular/router";
import { ImageHelperService } from "@maxxton/components/helpers";
import { TreeNode } from "microdocs-core-ts/dist/domain";
import { ProjectService } from "./../services/project.service";
import { Subject } from "rxjs/Subject";
export declare class App {
    private image;
    private projectService;
    private router;
    private showFullSideBar;
    private user;
    private login;
    projects: Subject<TreeNode>;
    envs: string[];
    selectedEnv: string;
    projectSub: any;
    constructor(image: ImageHelperService, projectService: ProjectService, router: Router);
    onEnvVersion(newEnv: any): void;
}
