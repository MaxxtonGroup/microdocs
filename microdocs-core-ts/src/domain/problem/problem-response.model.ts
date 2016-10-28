
import { Problem } from "./problem.model";
export interface ProblemResponse{

  problems?:Problem[];
  status?:string;
  message?:string;

}