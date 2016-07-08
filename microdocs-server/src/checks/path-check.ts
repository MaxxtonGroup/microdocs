import {ProblemReport, Path} from "microdocs-core-ts/dist/domain";

export interface PathCheck {

    getName():string;
    check(clientEndpoint:Path, producerEndpoint:Path, problemReport:ProblemReport):void;

}