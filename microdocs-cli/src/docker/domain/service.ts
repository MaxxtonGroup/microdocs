import { Build } from "./build";
export interface Service{

  container_name?:string;
  image?:string;
  build?:string|Build;
  ports?:string[];
  environment?:string[];
  links?:string[];
  volumes?:string[];
  networks?:string[];

}