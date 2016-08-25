
import {Project} from "../project.model";
export interface ProjectSettings{

  global?:{[title:string]:Project};
  environments?:{[title:string]:Project};
  groups?:{[title:string]:Project};
  projects?:{[title:string]:Project};

}

export interface Environments{
  default?:boolean;
}