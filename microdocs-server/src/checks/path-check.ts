import {ProblemReport, Path, Project} from "microdocs-core-ts/dist/domain";

export interface PathCheck {

    getName():string;
    check(clientEndpoint:Path, producerEndpoint:Path, project:Project, problemReport:ProblemReport):void;

}