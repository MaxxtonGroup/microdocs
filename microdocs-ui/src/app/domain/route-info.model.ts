
export interface RouteInfo {

  path?: string;
  pathMatch?: string;
  pathParams?: {[key:string]:any};
  component?: any;
  name?: string;
  icon?: string;
  iconOpen?: string;
  children?: RouteInfo[];
  open?:boolean;
  postIcon?: string;
  postIconColor?: string;
  generateIcon?: true;
  generateIconColor?:string;

}
