
import {Project} from "../project.model";
export interface ProjectSettings{

  environments?:{[name:string]:Environments};
  conditions?:Conditions;
  'static'?:Static;

}

export interface Environments{
  default?:boolean;
}

export interface Conditions{
  //todo
}

export interface Static{

  global?:{[title:string]:Project};
  environments?:{[title:string]:Project};
  groups?:{[title:string]:Project};
  projects?:{[title:string]:Project};

}