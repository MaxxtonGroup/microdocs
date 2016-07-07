
import {ProblemLevel} from "./problem-level.model";

export interface Problem{
    
    level:ProblemLevel;
    description:string;
    
    $ref:string;
    
    
}