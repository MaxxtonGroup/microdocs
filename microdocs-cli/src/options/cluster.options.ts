
import { ServerOptions } from "./server.options";

export interface ClusterOptions extends ServerOptions{

  clusterName?:string;
  targetProject?:string;
  targetVersion?:string;
  filterProjects?:string;
  filterGroups?:string;
  env?:string;
  build?:boolean;
  dockerfile?:string;
  buildArgs?:{[key:string]:string};
  buildContext?:string;
  denv?:string[];
  dpublish?:string[];
  dvolume?:string[];

}