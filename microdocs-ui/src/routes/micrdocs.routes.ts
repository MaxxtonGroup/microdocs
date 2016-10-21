import {DashboardRoute} from "./dashboard/dashboard";
import {ProjectRoute} from "./project/project.route";

/**
 * Created by Reinartz.T on 22-6-2016.
 */

export const MicrodocsRoutes:Array<{path:string, component?:any, pathMatch?:"full" | "prefix", redirectTo?:string, hidden?:boolean, name?:string, children?:Array<{}>}> = [
    {path: '', pathMatch: 'full', redirectTo: 'dashboard', name: 'MicroDocs', hidden: true},
    {path: 'dashboard', component: DashboardRoute, name: 'MicroDocs', hidden: true},
    {path: 'projects/:project', component: ProjectRoute, name: 'Project', hidden: true}

];