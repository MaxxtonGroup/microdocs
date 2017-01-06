
import { Service } from "./service";

export interface DockerCompose{

  version?:string;
  services?: {[name:string]:Service};
  networks?:any;

}