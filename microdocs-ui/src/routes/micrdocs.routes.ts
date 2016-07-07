import { DashboardRoute } from "./dashboard/dashboard";

/**
 * Created by Reinartz.T on 22-6-2016.
 */

export const MicrodocsRoutes:Array<{path:string, component?:any, pathMatch?:"full" | "prefix", redirectTo?:string, hidden?:boolean, name?:string }> = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard', name: 'Price manager', hidden: true },
  { path: 'dashboard', component: DashboardRoute, name: 'Price manager', hidden: true }
];