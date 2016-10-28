
import {Component, Input} from "@angular/core";

import {Problem} from "@maxxton/microdocs-core/domain";
import {FILTERS} from "@maxxton/components/filters";


@Component({
  selector: 'problem-panel',
  templateUrl: 'problem.panel.html',
  pipes: [FILTERS]
})
export class ProblemPanel{

  @Input()
  problems:Problem[];

}