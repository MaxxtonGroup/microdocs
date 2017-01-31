export interface Build{
  context?:string;
  dockerfile?:string;
  args?:{[key:string]:string}
}