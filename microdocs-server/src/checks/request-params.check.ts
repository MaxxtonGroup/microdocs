import {PathCheck} from "./path-check";
import {Path, ProblemReport} from "microdocs-core-ts/dist/domain";

export class RequestParamsCheck implements PathCheck {

    public getName():string {
        return "request-param";
    }

    public check(clientEndpoint:Path, producerEndpoint:Path, problemReport:ProblemReport) : void{

    }

}