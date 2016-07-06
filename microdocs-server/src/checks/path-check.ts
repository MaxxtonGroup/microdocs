import {ProblemReport} from "../domain/problem/problem-report.model";
import {Path} from "../domain/path/path.model";

export interface PathCheck {

    getName():string;
    check(clientEndpoint:Path, producerEndpoint:Path, problemReport:ProblemReport);

}