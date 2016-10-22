import {Path, Project} from "@maxxton/microdocs-core-ts/dist/domain";
import {ProblemReporter}  from '@maxxton/microdocs-core-ts/dist/helpers';

export interface PathCheck {

  getName():string;
  check(clientEndpoint:Path, producerEndpoint:Path, project:Project, problemReport:ProblemReporter):void;

}