import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { TreeNode, Project, Environments } from "microdocs-core-ts/dist/domain";
export declare class ProjectService {
    private http;
    private env;
    constructor(http: Http);
    getProjects(env?: string): Observable<TreeNode>;
    getProject(name: string, version?: string, env?: string): Observable<Project>;
    setSelectedEnv(env: string): void;
    getSelectedEnv(): string;
    getEnvs(): Observable<{
        [key: string]: Environments;
    }>;
    private getApiUrl(path, params?);
}
