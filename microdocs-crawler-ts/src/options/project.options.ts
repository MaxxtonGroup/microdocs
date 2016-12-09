
import { ServerOptions } from "./server.options";

export interface ProjectOptions extends ServerOptions{

  title?:string;
  filterGroups?:string;
  filterProjects?:string;
  env?:string;

}