import {Path, Project} from "@maxxton/microdocs-core/domain";
import {ProblemReporter}  from '@maxxton/microdocs-core/helpers';

export interface PathCheck {

  getName():string;
  check(clientEndpoint:Path, producerEndpoint:Path, project:Project, problemReport:ProblemReporter):void;

}