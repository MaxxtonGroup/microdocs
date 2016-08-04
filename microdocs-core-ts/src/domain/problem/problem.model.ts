
export interface Problem {

  level:string;
  message:string;
  package?:string;
  className?:string;
  path?:string;
  lineNumber?:number;
  client?:ProblemClient;

}

export interface ProblemClient{

  title:string;
  version:string;
  package?:string;
  className?:string;
  path?:string;
  lineNumber?:number;
  sourceLink?:string;

}