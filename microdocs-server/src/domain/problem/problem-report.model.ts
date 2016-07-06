
import {ProblemLevel} from "./problem-level.model";
import {Problem} from "./problem.model";

export class ProblemReport{

    private problems:Problem[] = [];

    constructor(private $ref:string){
    }

    public report(level:ProblemLevel, description:string){
        var problem : Problem = {level:level, description:description, $ref:this.$ref};
        this.problems.push(problem);
    }

    public getProblems() : Problem[]{
        return this.problems;
    }

}