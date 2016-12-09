
import { DeployBuild } from "./deploy-build.model";
export interface Deploy{
  containerName?:string;
  image?:string;
  exposePorts?:string[];
  alias?:string;
  build?:DeployBuild;
  environment?:string[];
}