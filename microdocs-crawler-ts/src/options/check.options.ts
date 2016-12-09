import { ServerOptions } from "./server.options";

export interface CheckOptions extends ServerOptions{

  title?: string;
  env?:string;

}