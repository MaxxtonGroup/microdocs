import {PathCheck} from "./path-check";
import {ProblemReport} from "../domain/problem/problem-report.model";

export class RequestParamsCheck implements PathCheck{

    public getName():string {
        return  "request-param";
    }

    public check(clientEndpoint:Path, producerEndpoint:Path, problemReport:ProblemReport){

    }

}